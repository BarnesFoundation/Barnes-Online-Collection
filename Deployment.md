# Deployment — Barnes Online Collection

Deploy ownership belongs to the Lead Developer. This documents each target so deploys transfer cleanly
(remediation card **CS-60**). Account `744014450301`, region `us-east-1`.

There are two environments:
- **Production** — the live legacy site on this `development` branch, served from Elastic Beanstalk, reading ElasticSearch.
- **Evolved dev preview** — the ElasticSearch→Postgres-V2 site on the `pg-v2-backend-swap` branch (and its feature branches). Review-only; promote-or-not is an open decision (**CS-61**). Its deploy tooling (`Dockerfile.lambda`) lives on that branch, not here.

---

## Elastic Beanstalk (dev + prod) — autodeploy on merge

Both the dev and prod Elastic Beanstalk instances **autodeploy on merge** (set up by Leigh) — there is **no manual `dist.zip` / EB-Console upload step**. Merging to the corresponding branch triggers the build (`npm run build` → `react-scripts build` → gulp `postbuild` → `dist.zip`) and deploys it automatically. The NodeJS Express server serves the built React app; prod reads the production ElasticSearch instance.

Because **merge = deploy** for these, only merge prod-affecting changes when the galleries are closed and there are no events.

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

**V2 connectivity (env):** the Lambda needs `PG_HOST` / `PG_PORT` / `PG_USER` / `PG_DATABASE` (+ `PG_PASSWORD` or `PG_IAM_AUTH=true`) and a network path to the V2 Postgres. Required for CS-55 (renditions from V2) on the prod server too — see that PR.

### Image / IIIF-tile CDN
Processed images + tiles live in S3 `barnes-data-processing-production`, served by CloudFront **`EBT379J21563X`** (`d2r83x5xt28klo.cloudfront.net`). To invalidate after overwriting a key, use an exact-path **batch file** (not `--paths $VAR`; wildcards cap at 15 in-progress):
```sh
aws cloudfront create-invalidation --distribution-id EBT379J21563X --invalidation-batch file://batch.json
```
