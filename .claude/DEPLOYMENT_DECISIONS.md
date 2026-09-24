# Collection site hosting: decisions and why

The *why* behind the Lambda hosting setup, kept out of `DEPLOY.md` (which is the how-to). Each entry is
current as of its date; update or add an entry when a decision changes.

## Architecture (CS-67, Sept 2026)

- **One Lambda runs the whole Express app, not an S3 front end + API-only Lambda.** The server does real
  work on non-API routes: server-rendered meta/OG tags on object pages, canonical
  `/objects/:id → /objects/:id/<title-slug>/` 301s, and `/track/image-download`. Serving the front end
  statically would have silently broken those. Moving static assets to S3 is a possible later
  optimization.
- **Zip Lambda + Lambda Web Adapter, not a container image.** There are no native dependencies, so the
  unmodified Express server (`node server/index.js`) runs on `nodejs22.x` via the adapter (`run.sh`).
- **Deployed with plain CloudFormation** (`aws cloudformation package` / `deploy`, which applies the SAM
  transform), so neither CI nor a person needs the SAM CLI.
- **Two private subnets (us-east-1f + us-east-1a) sharing one NAT gateway.** The Lambda needs NAT egress
  (ElasticSearch on Elastic Cloud, the Craft CMS, NetX) and must reach the RDS Proxy. The NAT is still a
  single point for outbound calls; a second NAT is the full-HA follow-up.

## Security

- **Function URL `AuthType: NONE` plus secret origin headers, not CloudFront OAC/IAM.** OAC signs
  requests with SigV4, but Lambda function URLs reject SigV4 on POST requests with a body, which broke
  the object grid (POST `/api/search`). In production mode the app rejects any request without the
  `X-CF-Secret` header CloudFront adds, so the raw function URL returns 403. Dev runs in development
  mode and doesn't check it.
- **Secrets in AWS Secrets Manager** (`barnes-collection-www/<env>`), read by the template with
  `{{resolve:secretsmanager}}`, so no deploy handles or stores a secret. The Wufoo *username* is the API
  key, so it's a secret too.
- **No static AWS keys.** `AWS_ACCESS_KEY`/`AWS_SECRET_KEY` are reserved env names in Lambda; the app's
  AWS SDK uses the Lambda execution role instead. `server/utils/pgClient.js` picks the role credentials
  by runtime: instance metadata on EC2/EB, environment credentials in Lambda.
- **GitHub → AWS via OIDC roles** (`infra/gha-deploy-role.yaml`), each scoped to its own stack's
  resources. The prod role only trusts jobs in the GitHub `production` Environment, whose approvers are
  Leigh and Steve (the SE team may approve deployments per Steve).

## Performance / caching

- **Custom CloudFront cache policies.** The managed ones put the `Host` header in the cache key, which
  forwards the viewer's Host to the origin, and a Lambda function URL rejects a Host it doesn't own.
- **`/static/*` is cached at the edge for a year** (content-hashed files); `/api/*` is never cached;
  pages follow the app's own `Cache-Control`.
- **Compression:** `Compress: true` on every behavior, plus `AWS_LWA_ENABLE_COMPRESSION` because
  CloudFront can't compress uncached `/api/*` responses (EB's nginx used to do this).
- **Every deploy invalidates CloudFront before the smoke test**, so nothing cached during the rollout
  (e.g. an uncompressed asset pinned for a year) survives.

## Content / data

- **`searchAssets.json` is committed**, and a weekly workflow opens a PR when it changes. EB generated it
  during its CodeBuild build (a step that lived in the CodeBuild project, not this repo) and refreshed it
  with a daily cron.
- **Postgres V2 renditions (CS-55) are off on prod** (`EnablePostgresV2=false`), matching prod before
  the move; activating CS-55 is a separate step. Dev has them on.

## Release process (CS-78)

- **Release-driven deploys:** a pre-release deploys to dev; promoting that same release deploys the
  same commit to prod after approval. Merges to `development` deploy nothing, so dev stays on the build
  being QA'd (Leigh's choice).
- **Prod workflow passes the domain explicitly.** The template defaults `DomainName` to empty, which
  would remove the alias. Releases `v2.0.0`–`v2.0.2` predate this and must never be redeployed.

## Cutover history

- **2026-09-23, attempt 1: rolled back after ~6 minutes.** The advanced-search dropdowns were empty
  (`searchAssets.json` 404) and responses weren't compressed. Both gaps came from EB behavior that
  lived outside the repo.
- **2026-09-24, attempt 2: succeeded**, with zero downtime via CloudFront `associate-alias`. EB and its
  CloudFront (`E2DCK8G8J67P5`) remain as a fallback until they're retired.
- **Lesson:** for any hosting move, diff the old platform's build config (CodeBuild buildspec,
  `.ebextensions`, cron) and response headers against the new one, and watch real traffic (status codes,
  404s, error logs) right after the switch, not just the smoke test.

## Known quirks

- The front-end build fails on Windows (`craco.config.js` matches `/css-loader/` with forward slashes);
  build on Linux (CI does).
- The Ensemble tab is disabled for objects not on view (`ensembleIndex` is empty) but looks enabled.
  This is pre-existing and has its own card.
