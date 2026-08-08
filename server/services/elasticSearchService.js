/**
 * Postgres-backed drop-in for the old ElasticSearch service (strangler-fig: the React front-end is
 * unchanged; only this data layer swaps ES -> the Postgres V2 store). It accepts the exact ES query
 * bodies the client builds (via bodybuilder) and answers them from `collection.collection_object`,
 * returning the identical ES response shape: { hits: { total: {value,relation}, hits: [{_index,_type,_id,_source}] } }.
 *
 * Guardrails (per "1b" — bounded/gated global search): parameterized SQL only (no string interpolation
 * of user input, so the Feb search-injection class can't reach the DB); a query-shape ALLOWLIST (only
 * known clause types are translated, everything else is ignored — arbitrary ES DSL cannot pass through);
 * and a hard result-size cap.
 */
const pool = require("../utils/pgClient");

const INDEX = process.env.ELASTICSEARCH_INDEX || "collection";
const MAX_SIZE = 500; // hard cap (client asks for up to 10000 for "whole room"; the store is ~3k, rooms are tiny)

// snake_case column -> camelCase ES _source field. The projection the client requests is honored,
// but id/imageSecret/imageOriginalSecret/invno are always present (needed for image URLs + renditions).
const COL_TO_FIELD = {
  id: "id", invno: "invno", title: "title", people: "people", medium: "medium",
  image: "image", image_secret: "imageSecret", image_original_secret: "imageOriginalSecret",
  ensemble_index: "ensembleIndex", visual_description: "visualDescription",
  obj_rights_type_id: "objRightsTypeId", on_view: "onview", curatorial_approval: "curatorialApproval",
  short_description: "shortDescription", long_description: "longDescription", nationality: "nationality",
  birth_date: "birthDate", death_date: "deathDate", artist_prefix: "artistPrefix", artist_suffix: "artistSuffix",
  culture: "culture", display_date: "displayDate", dimensions: "dimensions", credit_line: "creditLine",
  bibliography: "bibliography", exh_history: "exhHistory", published_provenance: "publishedProvenance",
  period: "period", highlight: "highlight", sorted_name: "sortedName", classification: "classification",
  begin_date: "beginDate", end_date: "endDate", copyright: "copyright",
};
const ALL_COLS = Object.keys(COL_TO_FIELD);
const ALWAYS = ["id", "invno", "image_secret", "image_original_secret"];

const asString = (b) => (typeof b === "string" ? JSON.parse(b) : b);
const arr = (x) => (Array.isArray(x) ? x : x == null ? [] : [x]);

/** Build the ES `_source` object for a row, honoring the requested projection (or all fields). */
function toSource(row, projection) {
  const fields = projection && projection.length ? projection : Object.values(COL_TO_FIELD);
  const want = new Set(fields);
  const src = {};
  for (const [col, field] of Object.entries(COL_TO_FIELD)) {
    if (want.has(field) || ALWAYS.includes(col)) {
      let v = row[col];
      if (col === "id") v = v == null ? v : Number(v);
      if (v !== null && v !== undefined && v !== "") src[field] = v;
    }
  }
  if (src.id == null && row.id != null) src.id = Number(row.id);
  return src;
}

function esResponse(rows, total, projection) {
  return {
    took: 0,
    hits: {
      total: { value: total, relation: "eq" },
      hits: rows.map((r) => ({ _index: INDEX, _type: "object", _id: String(r.id), _source: toSource(r, projection) })),
    },
  };
}

/** Extract a comparable list of query clauses from a (possibly nested) ES query body. */
function collectClauses(query) {
  const out = [];
  if (!query || typeof query !== "object") return out;
  if (query.bool) {
    for (const c of arr(query.bool.filter)) out.push({ where: "filter", clause: c });
    for (const c of arr(query.bool.must)) out.push({ where: "must", clause: c });
    for (const c of arr(query.bool.should)) out.push({ where: "should", clause: c });
    out._msm = query.bool.minimum_should_match;
  } else {
    out.push({ where: "must", clause: query });
  }
  return out;
}

/** Translate an ES search body -> { sql, params, projection, moreLikeThisId }. Allowlist only. */
function translate(body) {
  const from = Math.max(0, parseInt(body.from, 10) || 0);
  const size = Math.min(MAX_SIZE, Math.max(1, parseInt(body.size, 10) || 25));
  const projection = Array.isArray(body._source) ? body._source : null;

  const where = [];
  const params = [];
  const p = (v) => { params.push(v); return `$${params.length}`; };

  const shoulds = []; // OR group (culture/nationality)
  let orderBy = null; // null => default
  let searchQuery = null;
  let moreLikeThisId = null;

  const clauses = collectClauses(body.query);
  for (const { where: bucket, clause } of clauses) {
    if (!clause || typeof clause !== "object") continue;
    const [type] = Object.keys(clause);
    const c = clause[type];
    switch (type) {
      case "exists":
        if (c.field === "imageSecret") where.push("image_secret <> ''");
        break;
      case "function_score": // landing randomization
        orderBy = "random()";
        break;
      case "match": {
        const field = Object.keys(c)[0];
        const val = typeof c[field] === "object" ? c[field].query : c[field];
        if (field === "_id") where.push(`id = ${p(parseInt(val, 10))}`);
        else if (field === "ensembleIndex") where.push(`${p(String(val))} = ANY(string_to_array(ensemble_index::text, ','))`);
        break;
      }
      case "multi_match": {
        const fields = c.fields || [];
        // Culture ADVANCED FILTER = multi_match over EXACTLY culture/nationality. The GLOBAL keyword
        // search also lists culture.* among many fields (people.*/title.*/medium.*/…) — so only treat
        // it as the culture filter when EVERY field is culture/nationality; otherwise it's global search.
        const isCulture = fields.length > 0 && fields.every((f) => /^culture|^nationality/.test(f));
        if (isCulture) {
          shoulds.push(`(culture ILIKE ${p("%" + c.query + "%")} OR nationality ILIKE ${p("%" + c.query + "%")})`);
        } else {
          searchQuery = c.query; // global keyword search -> tsvector
        }
        break;
      }
      case "more_like_this":
        moreLikeThisId = parseInt((arr(c.like)[0] || {})._id, 10);
        break;
      case "terms": {
        const field = Object.keys(c)[0];
        const vals = c[field] || [];
        if (!vals.length) break;
        if (field === "classification") where.push(`classification = ANY(${p(vals.map(String))})`);
        else if (field === "people.text" || field === "people") where.push(`people = ANY(${p(vals.map(String))})`);
        else if (field === "objRightsTypeId") where.push(`obj_rights_type_id = ANY(${p(vals.map((v) => parseInt(v, 10)))})`);
        else if (field === "ensembleIndex") where.push(`string_to_array(ensemble_index::text, ',') && ${p(vals.map(String))}`);
        break;
      }
      case "range": {
        const field = Object.keys(c)[0];
        const spec = c[field];
        if (field === "beginDate" && spec.gte != null) where.push(`begin_date >= ${p(parseInt(spec.gte, 10))}`);
        else if (field === "endDate" && spec.lte != null) where.push(`end_date <= ${p(parseInt(spec.lte, 10))}`);
        // visual-descriptor ranges (line/light/space/vertical/diagonal/horizontal/curvy) are NOT in V2 -> ignored
        break;
      }
      // dis_max (color/line visual filters), bool nesting, etc. -> ignored (descriptor gap; allowlist)
      default:
        break;
    }
  }

  // OR group with minimum_should_match => require at least one should to match
  if (shoulds.length) where.push("(" + shoulds.join(" OR ") + ")");

  // global keyword search -> tsvector rank. Reuse ONE placeholder in both WHERE and ORDER BY so the
  // params array matches the count query (which has only the WHERE clause) — no bind-count mismatch.
  if (searchQuery) {
    const sp = p(searchQuery);
    where.push(`search_tsv @@ websearch_to_tsquery('english', ${sp})`);
    if (!orderBy) orderBy = `ts_rank(search_tsv, websearch_to_tsquery('english', ${sp})) DESC, ensemble_index NULLS LAST`;
  }

  // sort translation (only when not already set by search/function_score)
  if (!orderBy) {
    const sort = arr(body.sort);
    for (const s of sort) {
      if (s && s._script) { orderBy = "random()"; break; }            // painless random -> random()
      if (s && s.endDate) { orderBy = "end_date ASC NULLS LAST"; break; } // artist filter
    }
  }
  if (!orderBy) orderBy = "ensemble_index NULLS LAST, id"; // stable gallery default

  const whereSql = where.length ? "WHERE " + where.join(" AND ") : "";
  const cols = ALL_COLS.join(", ");
  const sql = `SELECT ${cols} FROM collection_object ${whereSql} ORDER BY ${orderBy} LIMIT ${size} OFFSET ${from}`;
  const countSql = `SELECT count(*)::int AS n FROM collection_object ${whereSql}`;
  return { sql, countSql, params, projection, moreLikeThisId, size };
}

/** pgvector "more like this" — replaces ES more_like_this. */
async function moreLikeThis(id, size, projection) {
  const cols = ALL_COLS.join(", ");
  const sql = `SELECT ${cols} FROM collection_object
    WHERE image_secret <> '' AND id <> $1 AND embedding IS NOT NULL
      AND (SELECT embedding FROM collection_object WHERE id = $1) IS NOT NULL
    ORDER BY embedding <=> (SELECT embedding FROM collection_object WHERE id = $1)
    LIMIT $2`;
  const { rows } = await pool.query(sql, [id, Math.min(MAX_SIZE, size)]);
  return esResponse(rows, rows.length, projection);
}

const performSearch = async (rawBody) => {
  const body = asString(rawBody) || {};
  const t = translate(body);
  if (t.moreLikeThisId) return moreLikeThis(t.moreLikeThisId, t.size, t.projection);
  const [dataRes, countRes] = await Promise.all([
    pool.query(t.sql, t.params),
    pool.query(t.countSql, t.params),
  ]);
  return esResponse(dataRes.rows, countRes.rows[0].n, t.projection);
};

const search = async (searchQuery) => {
  try {
    return await performSearch(searchQuery);
  } catch (error) {
    console.error(`[error] pg search: ${error.message}`);
    return { took: 0, hits: { total: { value: 0, relation: "eq" }, hits: [] } };
  }
};

const getObjectById = async (objectId) => {
  try {
    const cols = ALL_COLS.join(", ");
    const { rows } = await pool.query(`SELECT ${cols} FROM collection_object WHERE id = $1`, [parseInt(objectId, 10)]);
    return rows[0] ? toSource(rows[0], null) : {};
  } catch (error) {
    console.error(`[error] pg getObjectById: ${error.message}`);
    return {};
  }
};

module.exports = { search, getObjectById, performSearch };
