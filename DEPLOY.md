# Collection site — Lambda deploy & switchover runbook (CS-67, monolith)

This deploys the **current app as-is** to a **CloudFront + single zip-Lambda** stack (`template.yaml`),
in parallel with the live Elastic Beanstalk site, then cuts over by DNS. **No functionality changes:**
the FULL Express server runs on the Lambda (SSR meta/OG on `/` + object pages, canonical
`/objects/:id` → `/objects/:id/<title-slug>/` 301s, `/track/image-download` GA+redirect,
`express.static` of the built FE, AND `/api/*`) — exactly what the EB container did. CloudFront is a
single origin in front of the Lambda.

**Dev deploys are automatic (CS-78):** every merge to `development` runs
`.github/workflows/deploy-dev.yml`, which builds, packages, deploys the `barnes-collection-www-dev` stack
and smoke-tests it (`scripts/smoke-test.sh`) at **https://dev.collection.barnesfoundation.org**, which
now points at this stack (DNS: Route53 A-alias -> the stack's CloudFront distribution; the stack owns the alias). It authenticates with GitHub OIDC via the role in
`infra/gha-deploy-role.yaml` — no AWS keys or app secrets in GitHub. The manual steps below are for
prod, for a first-time stack, or for debugging a failed run.

## 0. Prerequisites

- **Secrets** live in AWS Secrets Manager as `barnes-collection-www/<env>` (JSON keys
  `ELASTICSEARCH_PASSWORD`, `GRAPHCMS_API_TOKEN`, `NETX_API_TOKEN`, `WWW_PASSWORD`, `X_ORIGIN_VERIFY`);
  the template reads them with `{{resolve:secretsmanager:...}}`, so no deploy passes secrets. dev is
  created; prod needs `barnes-collection-www/prod`. After changing a value, redeploy with a template or
  parameter change — CloudFormation only re-reads a secret when the resource using it changes.
- **CI deploy role** (once per env): `infra/gha-deploy-role.yaml` (GitHub OIDC role + artifacts bucket;
  deploy command in its header). dev: `barnes-online-collection-gha-deploy-dev`.
- **VPC egress** — the Lambda's subnets must reach the RDS Proxy AND the public internet (ES on Elastic
  Cloud + the Craft/Hygraph CMS + NetX), i.e. a subnet with a NAT gateway. dev: `subnet-021d7a72948b68fb1` / `sg-2480035b`.
- **LWA layer** — pin the current us-east-1/x86_64 Lambda Web Adapter layer version (`LwaLayerArn`).
- **Prod only:** an ACM cert (us-east-1) for `collection.barnesfoundation.org`, `DomainName` set, and
  ≥2 subnets across AZs. Also reconcile the origin-verify header (see note in step 4).

## 1. Build the FE

`REACT_APP_*` are baked into the bundle at build time from the target env's config. Build with the
same values as the EB env you are mirroring.

```
npm ci
REACT_APP_IMAGE_BASE_URL=... REACT_APP_NETX_ENABLED=true ...(all REACT_APP_*)... npm run build
```

On a non-Linux dev box, build in a Linux container so `craco.config.js`'s css-loader url filter
matches (it keys on a `/css-loader/` path — Windows backslash paths miss it) and so any native deps
match the Lambda platform:

```
docker run --rm -v "$PWD:/repo:ro" -v "$PWD/out:/out" -e CI=false <REACT_APP_* -e ...> node:20 \
  bash -c 'cd /repo && tar cf - --exclude=node_modules --exclude=build --exclude=.git . \
    | (mkdir /work && cd /work && tar xf -) && cd /work && npm ci && npm run build && cp -r build /out/'
```

## 2. Assemble the Lambda package

`template.yaml`'s `CodeUri` is `lambda-pkg/` — the full server + `build/` + prod-only `node_modules`.
Build it on Linux (matches the `nodejs22.x` runtime):

```
scripts/package-lambda.sh
# non-Linux: docker run --rm -v "$PWD:/repo" -w /repo node:20 bash scripts/package-lambda.sh
```

## 3. Deploy the stack

SAM CLI:
```
sam build && sam deploy --config-env dev \
  --parameter-overrides "VpcSubnetIds=... VpcSecurityGroupIds=..."
```
Or AWS-native (no SAM CLI needed — CloudFormation applies the SAM transform):
```
aws cloudformation package --template-file template.yaml \
  --s3-bucket barnes-online-collection-deploy-artifacts-744014450301 --s3-prefix barnes-collection-www-dev \
  --output-template-file packaged.yaml
aws cloudformation deploy --template-file packaged.yaml --stack-name barnes-collection-www-dev \
  --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND \
  --parameter-overrides EnvName=dev VpcSubnetIds=subnet-021d7a72948b68fb1 VpcSecurityGroupIds=sg-2480035b
```
Leave `DomainName` empty for a parallel test stack on the default `*.cloudfront.net` domain (no alias,
no DNS, no CNAME conflict). Note the outputs: `DistributionId`, `DistributionDomainName`, `ApiFunctionUrl`.

## 4. Verify on the CloudFront domain (BEFORE any DNS change)

Run `scripts/smoke-test.sh https://<DistributionDomainName>` (health, app shell, GET + POST search,
Postgres renditions, the canonical redirect), then hit a few deep links by hand. Confirm search (ES),
object pages (incl. the canonical title-slug redirect + server-rendered meta), carousel renditions
(Postgres, CS-55), and `/track/image-download/...` all work. This is the whole site on Lambda with no
public traffic yet.

**Postgres (CS-55):** set `EXPECT_RENDITIONS=false` for an env deployed with `EnablePostgresV2=false`
(prod, until CS-55 is activated) — the smoke test then asserts there are *no* renditions.

## 5. Prod

Prod deploys only through `.github/workflows/deploy-prod.yml`, and only with Steve's approval:

1. **Release:** publish a (full) GitHub Release with a `v*` tag cut from `development`, or run the
   workflow manually on `development`. Pre-releases don't trigger it. The job refuses any commit that
   isn't on `development`.
2. **Approval:** the job runs in the GitHub **`production`** Environment and waits for its required
   reviewer (Steve). The prod AWS role (`barnes-online-collection-gha-deploy-prod`) trusts only jobs
   in that Environment, so no AWS credentials exist until he approves.
3. **Deploy + smoke test:** stack `barnes-collection-www-prod` with the prod settings (mirrors the EB env
   `collection-server-production`): `NODE_ENV=production`, the prod ES cluster, Wufoo, the existing
   bot-blocker WAF web ACL, and `EnablePostgresV2=false` (CS-55 stays dormant, as on prod today).

What the prod stack reproduces from the current prod CloudFront (`E2DCK8G8J67P5`): the WAF web ACL; the
`X-CF-Secret` / `X-CF-Proto` / `X-Forwarded-Proto` origin headers the app checks in production mode
(`X-CF-Secret` comes from the secret's `X_CF_SECRET`); origin-driven caching on the default behavior and
no caching on `/api/*`; IPv6. New on top: content-hashed `/static/*` assets are cached at the edge for a
year.

**Before the cutover** `DOMAIN_NAME` is empty in the workflow, so prod runs in parallel on its own
`*.cloudfront.net` URL while `collection.barnesfoundation.org` keeps serving from Elastic Beanstalk.

**First prod deploy only:** the prod role starts in bootstrap mode (it may create a distribution). Once
the stack exists, redeploy the role with `DistributionId=<stack output>` to pin it (see
`infra/gha-deploy-role.yaml`).

## 6. Cutover (collection.barnesfoundation.org — on Steve's explicit go, galleries-closed window)

Zero-downtime, unlike the dev cutover (which removed the alias first and accepted a short blip):
1. **Cert first:** already done: `deploy-prod.yml` sets `ACM_CERT_ARN` (the collection cert,
   `…/0510ebbf-…`) from the first deploy, so the prod distribution holds the cert but not the alias.
2. **Prove ownership:** Route53 (zone `Z4SK0ES98JH0U`) TXT record `_collection.barnesfoundation.org` →
   the prod distribution's `*.cloudfront.net` domain (required by `associate-alias` to move an alias
   that another distribution holds).
3. **Move the alias atomically:** back up `E2DCK8G8J67P5`'s config, then
   `aws cloudfront associate-alias --target-distribution-id <prod dist> --alias collection.barnesfoundation.org`.
   CloudFront edges route by host name, so requests should reach the new distribution once this
   propagates, even while DNS still points at the old one. Confirm with the smoke test before step 5.
4. **Let the stack own it:** set `DOMAIN_NAME=collection.barnesfoundation.org` and deploy (approved) — no
   change to the live alias, but no later deploy can drop it.
5. **DNS:** A + AAAA alias records for `collection` → the prod stack's distribution; remove the TXT record.
6. `EXPECT_RENDITIONS=false scripts/smoke-test.sh https://collection.barnesfoundation.org`.

## 7. Rollback

Before the cutover there is nothing to roll back — prod traffic never left Elastic Beanstalk. After it:
`associate-alias` the name back to `E2DCK8G8J67P5` (the TXT record must then point at
`d12eupwxjvau2q.cloudfront.net`) and point the Route53 records back at it; EB and the old distribution stay running and untouched throughout, so this is immediate.
Decommissioning EB (and its pipelines) happens only after the Lambda site is proven.
