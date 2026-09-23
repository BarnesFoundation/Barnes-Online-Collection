#!/bin/bash
# Post-deploy smoke test for the Lambda stack (CS-78). Usage: scripts/smoke-test.sh https://<domain>
# EXPECT_RENDITIONS=true (default) requires Postgres V2 carousel renditions on search hits; set it to
# false for an env running with EnablePostgresV2=false (prod until CS-55 is activated), which then
# asserts there are none.
#
# Covers the paths that have actually broken before:
#   - POST /api/search (the object grid) — CloudFront OAC once rejected POST bodies while GET worked
#   - Postgres rendition enrichment on search hits (RDS IAM auth from Lambda)
#   - the server-side canonical /objects/:id -> /objects/:id/<title-slug>/ redirect (SSR routes)
# Retries absorb a cold start of the in-VPC Lambda. Needs curl + jq.
set -euo pipefail

BASE="${1:?usage: smoke-test.sh https://<domain>}"
fail() { echo "SMOKE FAIL: $*" >&2; exit 1; }

# /health, with retries for a cold start after the deploy.
for i in $(seq 1 10); do
  code=$(curl -s -o /dev/null -w '%{http_code}' -m 30 "$BASE/health" || true)
  [ "$code" = "200" ] && break
  echo "health attempt $i -> $code; retrying"; sleep 6
done
[ "$code" = "200" ] || fail "/health -> $code"
echo "ok   /health"

code=$(curl -s -o /dev/null -w '%{http_code}' -m 30 "$BASE/")
[ "$code" = "200" ] || fail "GET / -> $code"
echo "ok   GET / (app shell)"

q='{"size":2,"query":{"match_all":{}}}'

get=$(curl -sS -m 60 -G "$BASE/api/search" --data-urlencode "body=$q")
n=$(jq -r '.hits.total.value // 0' <<<"$get")
[ "$n" -gt 0 ] || fail "GET /api/search returned no hits: $(head -c 300 <<<"$get")"
echo "ok   GET /api/search ($n hits)"

post=$(curl -sS -m 60 -X POST "$BASE/api/search" -H 'Content-Type: application/json' -d "{\"body\":$q}")
n=$(jq -r '.hits.total.value // 0' <<<"$post")
[ "$n" -gt 0 ] || fail "POST /api/search returned no hits: $(head -c 300 <<<"$post")"
echo "ok   POST /api/search ($n hits)"

# The `renditions` key is always set (empty when the V2 read fails or is disabled), so count real ones
# over a wide sample: only a few percent of objects have carousel images.
wide=$(curl -sS -m 60 -X POST "$BASE/api/search" -H 'Content-Type: application/json' \
  -d '{"body":{"size":200,"query":{"match_all":{}}}}')
with=$(jq '[.hits.hits[]._source.renditions // [] | length | select(. > 0)] | length' <<<"$wide")
if [ "${EXPECT_RENDITIONS:-true}" = "true" ]; then
  [ "$with" -gt 0 ] || fail "no search hit carries Postgres renditions (V2 enrichment / RDS IAM auth broken?)"
  echo "ok   Postgres renditions on $with of 200 sampled hits"
else
  [ "$with" -eq 0 ] || fail "$with hits carry renditions but this env should run with Postgres V2 off"
  echo "ok   no renditions (Postgres V2 off, as configured)"
fi

loc=$(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' -m 30 --max-redirs 0 "$BASE/objects/7069")
[[ "$loc" == 301\ */objects/7069/* ]] || fail "canonical redirect /objects/7069 -> '$loc'"
echo "ok   SSR canonical redirect ($loc)"

echo "SMOKE OK: $BASE"
