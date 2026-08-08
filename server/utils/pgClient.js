// Read-only Postgres pool to the V2 store (collection.collection_object).
// Replaces the ElasticSearch client for the collection search/read path. Uses the SELECT-only
// `collection_reader` role — the site cannot write by construction. search_path pinned to `collection`.
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
  options: `-c search_path=${process.env.PG_SCHEMA || "collection"},public`,
});

pool.on("error", (err) => console.error("[pg] idle client error:", err.message));

module.exports = pool;
