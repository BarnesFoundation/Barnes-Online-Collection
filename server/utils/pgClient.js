// Read-only Postgres pool to the V2 store (collection.collection_object).
// Replaces the ElasticSearch client for the collection search/read path. Uses the SELECT-only
// `collection_reader` role — the site cannot write by construction. Queries are SCHEMA-QUALIFIED
// (`collection.collection_object`) and pgvector lives in `public`, so NO `search_path` startup param
// is needed — which is required for RDS Proxy compatibility (RDS Proxy for Postgres rejects the
// `options=-c search_path=...` startup parameter). Works identically against direct RDS.
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT || "5432", 10),
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE || "postgres",
  ssl: { rejectUnauthorized: false },
  max: 8,
  idleTimeoutMillis: 30000,
});

pool.on("error", (err) => console.error("[pg] idle client error:", err.message));

module.exports = pool;
