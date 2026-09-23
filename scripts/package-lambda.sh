#!/bin/bash
# Assemble the Lambda deployment package (lambda-pkg/) for the CS-67 monolith: the full Express
# server + built FE + prod-only node_modules. template.yaml's CodeUri points at lambda-pkg/, so both
# `aws cloudformation package` and a future `sam build/deploy` zip this same, already-trimmed dir.
#
# Run at the repo root on LINUX (matches the nodejs22.x Lambda), AFTER building the FE:
#   npm ci && npm run build && scripts/package-lambda.sh
#
# On a non-Linux dev box, run it in a Linux container so node_modules match the Lambda platform:
#   docker run --rm -v "$PWD:/repo" -w /repo node:20 bash scripts/package-lambda.sh
set -euo pipefail
cd "$(dirname "$0")/.."     # repo root

test -d build || { echo "build/ missing — build the FE first (npm run build)"; exit 1; }

PKG=lambda-pkg
rm -rf "$PKG"
mkdir -p "$PKG"

# Runtime code the Express server needs at runtime: server/, src/ (shared config/utils +
# artObjectTitles.json), scripts/ (build-search-assets), the LWA entrypoint, the manifest + lockfile,
# and the built FE (build/ — express.static + the SSR meta routes read build/index.html).
cp -r server src scripts build "$PKG"/
cp run.sh package.json package-lock.json "$PKG"/
# .npmrc carries legacy-peer-deps=true — required or the CRA-5-era peer specs fail npm ci (ERESOLVE).
[ -f .npmrc ] && cp .npmrc "$PKG"/

# Prod-only dependencies, installed for the Lambda's platform (run on Linux).
( cd "$PKG" && npm ci --omit=dev --no-audit --no-fund )

echo "packaged -> $PKG"
du -sh "$PKG" 2>/dev/null || true
