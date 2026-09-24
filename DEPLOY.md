# Deploying the collection site

collection.barnesfoundation.org runs on AWS: a CloudFront distribution in front of one Lambda function,
which runs the Express app (`server/`) and serves the built React front end. Deploys run in GitHub
Actions. You don't need AWS access for a normal deploy.

|                  | Dev                                         | Prod                                        |
| ---------------- | ------------------------------------------- | ------------------------------------------- |
| URL              | https://dev.collection.barnesfoundation.org | https://collection.barnesfoundation.org     |
| Deployed by      | publishing a **pre-release**                | promoting it to a **release** + approval    |
| Workflow         | Deploy dev (Lambda)                         | Deploy prod (Lambda)                        |
| CloudFormation   | `barnes-collection-www-dev`                 | `barnes-collection-www-prod`                |

**Merging a PR into `main` does not deploy anything.**

## Deploy to dev

1. GitHub → **Releases** → **Draft a new release**.
2. **Choose a tag** → type a new one named for the version you plan to ship (e.g. `v2.0.4`).
   **Target:** `main`.
3. Tick **Set as a pre-release**, then **Publish release**.
4. **Actions** → *Deploy dev (Lambda)* runs automatically (about 5 minutes). Green means it deployed and
   passed the smoke test.

Dev stays on that build until the next pre-release.

## Deploy to prod

1. After QA on dev, open the same release, **untick "Set as a pre-release"**, and click **Update release**.
2. **Actions** → *Deploy prod (Lambda)* starts and waits for approval. Leigh or Steve: open the run →
   **Review deployments** → approve.
3. About 5 minutes later, green means it deployed and passed the smoke test on the live site.

Prod always gets the exact commit that was tested on dev.

## Check a deploy

- **Actions tab:** each run shows the build, the deploy and the smoke test (health, search, the
  advanced-search dropdown file, compression, object-page redirects).
- **A failed "Deploy stack" step:** the run's last step prints the CloudFormation error.
- **Redeploy:** Actions → the workflow → **Run workflow** → pick a branch or tag that is on
  `main`. Prod runs still need approval.
- **App logs:** CloudWatch (us-east-1) log groups `/aws/lambda/barnes-collection-www-dev` and
  `/aws/lambda/barnes-collection-www-prod`.

## Roll back prod

Redeploy the previous release: Actions → *Deploy prod (Lambda)* → **Run workflow** → **Use workflow
from:** the previous tag → approve.

> ⚠️ **Never redeploy `v2.0.0`–`v2.0.2`.** Their workflow predates the prod domain setting, and running
> them would disconnect collection.barnesfoundation.org from the site.

**While Elastic Beanstalk is still running** (until it's retired), the whole site can also be pointed back
at it. This needs AWS admin access; see "Emergency: back to Elastic Beanstalk" at the end.

## Configuration and secrets

- **Secrets** (ElasticSearch password, Craft/NetX tokens, Wufoo, origin-verification secrets) live in AWS
  Secrets Manager: `barnes-collection-www/dev` and `barnes-collection-www/prod`. After changing one,
  redeploy. CloudFormation only picks up a changed secret when something else in the deploy changes too;
  if the new value doesn't take effect, ask whoever manages AWS.
- **Build-time settings** (`REACT_APP_*`) are in the *Build front end* step of each workflow file.
- **Runtime settings** are parameters in `template.yaml`. Prod's values are set in
  `deploy-prod.yml` → *Deploy stack*.

## Advanced-search dropdown data

`public/resources/searchAssets.json` holds the advanced-search dropdown options and is committed to the
repo. The *Refresh search assets* workflow regenerates it every Monday and opens a PR if anything
changed. Merge that PR, and the update ships with the next release.

## Where things live

- `template.yaml`: the app's AWS stack (Lambda + CloudFront). Its comments explain the design choices.
- `.github/workflows/`: `deploy-dev.yml`, `deploy-prod.yml`, `refresh-search-assets.yml`.
- `scripts/package-lambda.sh` builds the Lambda package; `scripts/smoke-test.sh` checks a deployed site.
- `infra/`: one-time AWS setup (the GitHub deploy roles and the Lambda's network). You rarely touch it.

## Deploying without GitHub Actions

Only if Actions is unavailable. Needs AWS admin access and a **Linux** machine or container: the front-end
build fails on Windows.

```bash
npm ci
# export the REACT_APP_* values from the matching workflow's "Build front end" step, then:
npm run build-css && npx craco build
bash scripts/package-lambda.sh
aws cloudformation package --template-file template.yaml \
  --s3-bucket barnes-online-collection-deploy-artifacts-744014450301 --s3-prefix <stack-name> \
  --output-template-file packaged.yaml
aws cloudformation deploy --template-file packaged.yaml --stack-name <stack-name> \
  --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND \
  --parameter-overrides <copy the list from the matching workflow's "Deploy stack" step>
bash scripts/smoke-test.sh https://<site>        # prod: EXPECT_RENDITIONS=false bash scripts/smoke-test.sh ...
```

## Emergency: back to Elastic Beanstalk

Only while the old Elastic Beanstalk site and its CloudFront distribution (`E2DCK8G8J67P5`,
`d12eupwxjvau2q.cloudfront.net`) still exist. Needs AWS admin access. It takes effect within seconds.

1. Route53 zone `Z4SK0ES98JH0U`: TXT record `_collection.barnesfoundation.org` = `"d12eupwxjvau2q.cloudfront.net"`.
2. `aws cloudfront associate-alias --target-distribution-id E2DCK8G8J67P5 --alias collection.barnesfoundation.org`
3. Route53: point the `collection` A record at `d12eupwxjvau2q.cloudfront.net`, delete the AAAA record and
   the TXT record.
4. Set the prod stack's `DomainName` parameter to empty (and `DOMAIN_NAME` in `deploy-prod.yml`), so the
   next prod deploy doesn't try to take the name back.
