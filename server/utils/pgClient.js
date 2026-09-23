// Read-only Postgres pool to the V2 store (collection.collection_object).
// Replaces the ElasticSearch client for the collection search/read path. Uses the SELECT-only
// `collection_reader` role — the site cannot write by construction. Queries are SCHEMA-QUALIFIED
// (`collection.collection_object`) and pgvector lives in `public`, so NO `search_path` startup param
// is needed — which is required for RDS Proxy compatibility (RDS Proxy for Postgres rejects the
// `options=-c search_path=...` startup parameter). Works identically against direct RDS.
const { Pool } = require("pg");

const port = parseInt(process.env.PG_PORT || "5432", 10);
// When PG_IAM_AUTH=true, authenticate to RDS Proxy with a short-lived IAM token instead of a stored
// password — so the Lambda holds NO DB password. Uses aws-sdk v2's RDS.Signer (already a dependency;
// token is computed locally via SigV4, no network). `password` is a function → pg fetches a fresh token
// per connection. Otherwise fall back to the env password (direct RDS / non-IAM).
let password = process.env.PG_PASSWORD;
if (process.env.PG_IAM_AUTH === "true") {
  const AWS = require("aws-sdk");
  // Sign the token with the ROLE credentials — NOT the process-wide static creds that server/app.js
  // may set via AWS.config.update. The proxy's `rds-db:connect` grant is on the role; signing as a
  // static IAM user would fail with an IAM/PAM error that reads like a DB-permission problem.
  // Where the role lives depends on the runtime: on EC2/Elastic Beanstalk it's the INSTANCE role
  // (loaded from IMDS); in Lambda there is no IMDS, so read the EXECUTION-role creds the runtime
  // injects as env vars (AWS_ACCESS_KEY_ID/SECRET/SESSION_TOKEN). Resolve before each getAuthToken
  // (cached; only re-fetched near expiry). Other AWS clients (S3/ES) use the same role.
  const roleCreds = process.env.AWS_LAMBDA_FUNCTION_NAME
    ? new AWS.EnvironmentCredentials("AWS")
    : new AWS.EC2MetadataCredentials();
  const signer = new AWS.RDS.Signer({
    region: process.env.AWS_REGION || "us-east-1",
    hostname: process.env.PG_HOST,
    port,
    username: process.env.PG_USER,
    credentials: roleCreds,
  });
  password = async () => {
    await roleCreds.getPromise();
    return signer.getAuthToken({});
  };
}

const pool = new Pool({
  host: process.env.PG_HOST,
  port,
  user: process.env.PG_USER,
  password,
  database: process.env.PG_DATABASE || "postgres",
  ssl: { rejectUnauthorized: false },
  max: 8,
  idleTimeoutMillis: 30000,
});

pool.on("error", (err) => console.error("[pg] idle client error:", err.message));

module.exports = pool;
