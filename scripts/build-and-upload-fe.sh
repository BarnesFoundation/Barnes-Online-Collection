#!/bin/bash
# Build the React FE (react-scripts 5 / Node 24) and publish it to the Lambda stack's S3 bucket,
# then invalidate CloudFront. This is the FE half of a deploy; `sam deploy` handles the API + infra.
#
# REACT_APP_* are baked into the bundle at BUILD time — export them (from the target env's config)
# before running, or the build inlines empty values. Required outputs from the SAM stack:
#   FE_BUCKET        = stack output FeBucketName
#   DISTRIBUTION_ID  = stack output DistributionId
#
#   FE_BUCKET=... DISTRIBUTION_ID=... REACT_APP_IMAGE_BASE_URL=... [other REACT_APP_*] \
#     ./scripts/build-and-upload-fe.sh
set -euo pipefail

: "${FE_BUCKET:?set FE_BUCKET (SAM stack output FeBucketName)}"
: "${DISTRIBUTION_ID:?set DISTRIBUTION_ID (SAM stack output DistributionId)}"

npm ci
# CI=false so CRA warnings don't fail the build; react-scripts 5 bakes REACT_APP_* from the env.
CI=false npm run build

# Publish the static build (the CRA `build/` dir; the postbuild gulp dist.zip is an EB artifact — ignored).
aws s3 sync build/ "s3://${FE_BUCKET}/" --delete
aws cloudfront create-invalidation --distribution-id "${DISTRIBUTION_ID}" --paths '/*'

echo "FE published to s3://${FE_BUCKET} and CloudFront ${DISTRIBUTION_ID} invalidated."
