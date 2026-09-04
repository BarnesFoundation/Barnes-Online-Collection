# Collection site — Lambda deploy & switchover runbook (CS-67)

This deploys the **current app** to the CloudFront + zip-Lambda + S3 stack defined in `template.yaml`,
in parallel with the live Elastic Beanstalk site, then cuts over by DNS. No functionality changes.
CI auto-deploy is a follow-up (CS-78); until then, deploys are deliberate and run from here.

## 0. Prerequisites (resolve the template `# CONFIRM`s first)

- **Prod ACM cert** (us-east-1) for `collection.barnesfoundation.org`.
- **Complete the runtime env set** — the server also reads `GRAPHCMS_ENDPOINT`, `AWS_REGION`/`AWS_BUCKET`,
  `NETX_API_TOKEN`, and six `REACT_APP_*` vars (source from EB env `collection-server-development`).
  Prefer the Lambda execution role for S3 over the EB app's static `AWS_ACCESS_KEY`/`SECRET_KEY`.
- **VPC egress** — the Lambda's subnets need a NAT gateway to reach ES (Elastic Cloud) + the Craft CMS.
- **Prod subnets** — ≥2 across AZs.
- **LWA layer version** — pin the current us-east-1/x86_64 version.
- **Packaging** — trim `CodeUri` (`.samignore`/makefile) so the zip is server + prod deps + required `src/`/`scripts/`.

## 1. Deploy the API + infra (SAM)

```
sam build
sam deploy --config-env dev \
  --parameter-overrides "XOriginVerify=$X_ORIGIN_VERIFY ElasticsearchPassword=$ES_PASSWORD"
```
Note the stack outputs: `DistributionId`, `DistributionDomainName`, `FeBucketName`, `ApiFunctionUrl`.

## 2. Publish the FE

```
FE_BUCKET=<FeBucketName> DISTRIBUTION_ID=<DistributionId> \
  REACT_APP_IMAGE_BASE_URL=... REACT_APP_NETX_ENABLED=false ...(all REACT_APP_*)... \
  ./scripts/build-and-upload-fe.sh
```

## 3. Verify on the CloudFront domain (BEFORE any DNS change)

Hit `https://<DistributionDomainName>/` and a few deep links + `/api/search?...`. Confirm search
(ES), object pages, and carousel renditions (Postgres, CS-55) all work. This is the whole site
running on Lambda with no public traffic yet.

## 4. Switchover (prod, on Steve's explicit go — galleries-closed window)

Repeat 1–3 with `--config-env prod`, verify on the prod CloudFront domain, then point
`collection.barnesfoundation.org` DNS at the prod CloudFront distribution.

## 5. Rollback

Revert the DNS record to the Elastic Beanstalk environment. EB stays running and untouched
throughout, so rollback is immediate. Decommissioning EB (and its autodeploy) happens only after
the Lambda site is proven — tracked with the branch restructure / CS-78.
