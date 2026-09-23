# Collection site — Lambda deploy & switchover runbook (CS-67, monolith)

This deploys the **current app as-is** to a **CloudFront + single zip-Lambda** stack (`template.yaml`),
in parallel with the live Elastic Beanstalk site, then cuts over by DNS. **No functionality changes:**
the FULL Express server runs on the Lambda (SSR meta/OG on `/` + object pages, canonical
`/objects/:id` → `/objects/:id/<title-slug>/` 301s, `/track/image-download` GA+redirect,
`express.static` of the built FE, AND `/api/*`) — exactly what the EB container did. CloudFront is a
single origin in front of the Lambda. CI auto-deploy is a follow-up (CS-78); until then deploys are
deliberate and run from here.

## 0. Prerequisites

- **Secrets** (values live on the EB env `collection-server-development`; pass at deploy, never commit):
  `ElasticsearchPassword`, `AwsAccessKey`, `AwsSecretKey`, `GraphCmsApiToken`, `NetxApiToken`, `WwwPassword`.
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
  --parameter-overrides "VpcSubnetIds=... VpcSecurityGroupIds=... <secrets>"
```
Or AWS-native (no SAM CLI needed — CloudFormation applies the SAM transform):
```
aws cloudformation package --template-file template.yaml \
  --s3-bucket <artifacts-bucket> --s3-prefix collection-www-dev \
  --output-template-file packaged.yaml
aws cloudformation deploy --template-file packaged.yaml --stack-name barnes-collection-www-dev \
  --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND \
  --parameter-overrides EnvName=dev VpcSubnetIds=subnet-021d7a72948b68fb1 \
    VpcSecurityGroupIds=sg-2480035b XOriginVerify=<v> ElasticsearchPassword=<v> \
    AwsAccessKey=<v> AwsSecretKey=<v> GraphCmsApiToken=<v> NetxApiToken=<v> WwwPassword=<v>
```
Leave `DomainName` empty for a parallel test stack on the default `*.cloudfront.net` domain (no alias,
no DNS, no CNAME conflict). Note the outputs: `DistributionId`, `DistributionDomainName`, `ApiFunctionUrl`.

## 4. Verify on the CloudFront domain (BEFORE any DNS change)

Hit `https://<DistributionDomainName>/` and a few deep links + `/api/search?...`. Confirm search (ES),
object pages (incl. the canonical title-slug redirect + server-rendered meta), carousel renditions
(Postgres, CS-55), and `/track/image-download/...` all work. This is the whole site on Lambda with no
public traffic yet.

**Prod origin-verify note:** when `NODE_ENV=production` the app rejects any request whose `x-cf-secret`
header != a hardcoded literal in `server/app.js` (NOT the template's `X-Origin-Verify`). Inert on dev
(`NODE_ENV=development`). Before a prod cutover, set the CloudFront custom header to match, or update
the app to read `X_ORIGIN_VERIFY`.

## 5. Switchover (prod, on Steve's explicit go — galleries-closed window)

Repeat 1–4 with `DomainName`/`AcmCertificateArn` set + `--config-env prod`, verify on the prod
CloudFront domain, then point `collection.barnesfoundation.org` DNS at the prod CloudFront distribution.

## 6. Rollback

Revert the DNS record to the Elastic Beanstalk environment (EB stays running + untouched throughout, so
rollback is immediate), or delete the CloudFormation stack. Decommissioning EB (and its autodeploy)
happens only after the Lambda site is proven — tracked with the branch restructure / CS-78.
