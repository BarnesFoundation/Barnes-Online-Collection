/** Attaches carousel renditions (and, for a single object, provenance + archives reference) to search
 *  results by reading the V2 collection store (`collection_object.images[]` jsonb) instead of fetching
 *  live from the NetX DAMS. Read-only. The primary/grid images already resolve via CloudFront
 *  (imageSecret); this only sources the carousel/alternate/archival renditions.
 *
 *  Rendition shape mirrors the former NetX shape so the front-end caption code is unchanged; `_cf: true`
 *  routes image-URL building to CloudFront (getImageURLFromRendition).
 */
const pool = require("../utils/pgClient");
const memoryCache = require("memory-cache");
const { oneWeek } = require("../constants/times");

const SCHEMA = process.env.PG_SCHEMA || "collection";
const CACHE_PREFIX = "V2_ASSET_CACHE";
const cacheKey = (id) => `${CACHE_PREFIX}_${id}`;

/** A V2 images[] entry -> a rendition object the carousel understands (CloudFront via _cf). */
function toRendition(im, objectId) {
  return {
    _cf: true,
    objectId,
    secret: im.secret,
    fileName: `${im.secret}.jpg`,
    isPrimary: !!im.isPrimary,
    isArchive: !!im.isArchive,
    attributes: {
      "Sync Type": [im.isArchive ? "Archives Sync" : ""],
      "Archives Correspondence Caption": [im.caption || ""],
      "Artwork Caption (TMS)": [im.caption || ""],
    },
  };
}

/** Batch-read V2 rows for the given object ids, with a per-id in-memory cache (mirrors the old DAMS cache). */
async function fetchV2ByIds(ids) {
  const out = new Map();
  const missing = [];
  for (const id of ids) {
    const cached = memoryCache.get(cacheKey(id));
    if (cached !== null && cached !== undefined) out.set(id, cached);
    else missing.push(id);
  }

  if (missing.length) {
    const { rows } = await pool.query(
      `SELECT id, images, published_provenance, published_archives_reference
         FROM ${SCHEMA}.collection_object
        WHERE id = ANY($1)`,
      [missing]
    );
    const byId = new Map(rows.map((r) => [Number(r.id), r]));
    for (const id of missing) {
      const r = byId.get(Number(id)) || {};
      const rec = {
        images: Array.isArray(r.images) ? r.images : [],
        publishedProvenance: r.published_provenance || "",
        publishedArchivesReference: r.published_archives_reference || "",
      };
      memoryCache.put(cacheKey(id), rec, oneWeek);
      out.set(id, rec);
    }
  }
  return out;
}

/**
 * Enrich each ES hit with its carousel renditions from the V2 store. A single-object request (the object
 * page) also gets its archival renditions + provenance/archives-reference text; multi-object requests
 * (search/grid) omit archival renditions, matching the prior behavior.
 */
async function getAssetsForArtworks(artworks) {
  if (!artworks || artworks.length === 0) return artworks;

  const ids = artworks
    .map((a) => a._source && a._source.id)
    .filter((id) => id !== null && id !== undefined);
  const v2 = await fetchV2ByIds(ids);
  const isSingle = artworks.length === 1;

  return artworks.map((artwork) => {
    const id = artwork._source.id;
    const rec = v2.get(id) || {
      images: [],
      publishedProvenance: "",
      publishedArchivesReference: "",
    };
    const images = isSingle ? rec.images : rec.images.filter((im) => !im.isArchive);
    artwork._source.renditions = images.map((im) => toRendition(im, id));

    if (isSingle) {
      // Only overwrite provenance when V2 has it (ES already carries a copy; don't blank it).
      if (rec.publishedProvenance) {
        artwork._source.publishedProvenance = rec.publishedProvenance;
      }
      artwork._source.publishedArchivesReference = rec.publishedArchivesReference;
    }
    return artwork;
  });
}

module.exports = {
  getAssetsForArtworks,
};
