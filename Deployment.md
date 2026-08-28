# Deployment — Barnes Online Collection

Deploy ownership belongs to the Lead Developer. This documents each target so deploys transfer cleanly
(remediation card **CS-60**). Account `744014450301`, region `us-east-1`.

There are two deploy targets:
- **Legacy site (Elastic Beanstalk)** — the live site served from EB, reading ElasticSearch. Two environments: **dev** (`collection-server-development`) and **prod** (`collection-server-production`). See below.
- **Evolved dev preview** — the ElasticSearch→Postgres-V2 site on the `pg-v2-backend-swap` branch (and its feature branches). Review-only; promote-or-not is an open decision (**CS-61**). Its deploy tooling (`Dockerfile.lambda`) lives on that branch, not here.

---

## Elastic Beanstalk (dev + prod) — autodeploy on merge

Both EB environments **autodeploy on merge** (set up by Leigh) — there is **no manual `dist.zip` / EB-Console upload step**. Each environment watches its own branch (CodePipeline → CodeBuild → EB):

| Branch | Pipeline | EB environment |
|---|---|---|
| `development` | `collection-dev-deploy` | `collection-server-development` (**dev**) |
| `master` | `collection-prod-deploy` | `collection-server-production` (**prod**) |

Merging to a branch triggers the build (`npm ci` → `npm run write-search-assets` → `npm run build`) and deploys the `dist/` artifact automatically. The NodeJS Express server serves the built React app; prod reads the production ElasticSearch instance.

> **Branch naming is legacy.** The team's intended pattern (not yet set up on this repo) is `main` → merge to `development` for a dev deploy → `development` → `production` for a prod deploy. Until that's in place it's `development`→dev, `master`→prod.

Because **merge = deploy**, only merge **prod**-affecting changes (to `master`) when the galleries are closed and there are no events. Merges to `development` deploy the **dev** environment only.

> **Dependency pinning (CS-63).** The deploy artifact ships `package-lock.json`, so EB installs the exact tree that was built and tested instead of re-resolving version ranges at deploy time. **Keep `package.json` and `package-lock.json` in sync** — regenerate the lock whenever you change dependencies, under Node 14 to match the platform: `docker run --rm -v "$PWD:/app" -w /app node:14 npm install --package-lock-only`. If a deploy ever fails on a lock mismatch, **regenerate the lock — do not drop the lockfile from the artifact.** Why it matters: the runtime is Node 14 (EOL — see CS-64), so an unpinned range can resolve to a version Node 14 can't run. This is exactly what broke the CS-55 deploy — `pg: ^8.13.1` re-resolved to 8.23.0 at deploy and crashed on `Cannot find module 'util/types'`.

---

## Evolved dev preview (run from the `pg-v2-backend-swap` branch)

CloudFront **`E1JZJA9HAZU7AG`** = `dev.collection.barnesfoundation.org`: default origin is the FE static bucket; `/api/*` routes to the `barnes-collection-www` Lambda (Postgres-V2 backed).

### Front-end static assets → S3 + CloudFront
```sh
docker build -f Dockerfile.lambda --target build -t bf-fe-build:dev .
# extract the built site and sync it:
docker create --name bf-fe bf-fe-build:dev && docker cp bf-fe:/app/build ./build-out && docker rm bf-fe
aws s3 sync ./build-out s3://barnes-collection-www-fe-744014450301
aws cloudfront create-invalidation --distribution-id E1JZJA9HAZU7AG --paths "/*"
```

### Read API Lambda (`barnes-collection-www`)
```sh
ECR=744014450301.dkr.ecr.us-east-1.amazonaws.com/barnes-collection-www-lambda
docker build -f Dockerfile.lambda --provenance=false -t $ECR:latest .   # full image (server + build/)
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 744014450301.dkr.ecr.us-east-1.amazonaws.com
docker push $ECR:latest
aws lambda update-function-code --function-name barnes-collection-www --image-uri $ECR:latest
aws lambda wait function-updated --function-name barnes-collection-www
```
One `docker build -f Dockerfile.lambda` produces both artifacts — extract `/app/build` (or `/var/task/build`) for the static sync, and push the same image for the Lambda. **Rollback:** re-push the prior ECR digest and re-run `update-function-code`.

## V2 connectivity (CS-55 read path)

Both the Lambda and the EB server can read carousel renditions from the V2 Postgres store (`collection.collection_object`) instead of live NetX. The V2 store is the RDS instance **`netx-intermediate-database`**, fronted by the **`collection-proxy`** RDS Proxy (POSTGRESQL, IAM auth required).

**EB server (legacy site) — where the vars go.** The `PG_*` vars belong on the **EB environment** (`aws:elasticbeanstalk:application:environment`), **not** the CodeBuild project — the buildspec is build-time only (`REACT_APP_*`) and does not reach the runtime server. Set on each env that should read V2:

| Var | Value |
|---|---|
| `PG_HOST` | `collection-proxy.proxy-cra1dp6a1lpd.us-east-1.rds.amazonaws.com` (the RDS **Proxy**) |
| `PG_PORT` | `5432` |
| `PG_USER` | `collection_reader` (read-only role) |
| `PG_DATABASE` | `postgres` |
| `PG_SCHEMA` | `collection` |
| `PG_IAM_AUTH` | `true` (no stored password) |

IAM auth also requires: the EB **instance role** has `rds-db:connect` on the proxy for `collection_reader`, and the env's security group is in the proxy's ingress. Use a **dedicated instance profile** per env (e.g. `collection-server-development-ec2-role`) — do **not** add the grant to the shared account-wide `aws-elasticbeanstalk-ec2-role`.

Gotcha: `server/app.js` sets process-wide static AWS creds via `AWS.config.update(...)`, so `pgClient` gives its `RDS.Signer` explicit `EC2MetadataCredentials` to sign the token as the instance role, not the static user. If IAM auth ever fails in a way that reads like a DB-permission error, check that first. If the store is unreachable the site **degrades gracefully** (serves results without carousel renditions), so a misconfig shows as missing renditions, not a 500.

Wired on **dev** 2026-08-28 (CS-55). **Prod** needs the same on `collection-server-production` + its own instance profile — Steve's call (account-wide role + prod deploy).

**Lambda (`barnes-collection-www`):** same vars; its role `barnes-collection-www-lambda-role` already carries the scoped `rds-db:connect`.

## Image / IIIF-tile CDN
Processed images + tiles live in S3 `barnes-data-processing-production`, served by CloudFront **`EBT379J21563X`** (`d2r83x5xt28klo.cloudfront.net`). To invalidate after overwriting a key, use an exact-path **batch file** (not `--paths $VAR`; wildcards cap at 15 in-progress):
```sh
aws cloudfront create-invalidation --distribution-id EBT379J21563X --invalidation-batch file://batch.json
```
