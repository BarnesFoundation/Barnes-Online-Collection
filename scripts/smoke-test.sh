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

# The advanced-search dropdowns load this file; a missing one broke them in cutover attempt #1.
sa=$(curl -sS -m 30 "$BASE/resources/searchAssets.json")
jq -e '(.artists | length) > 0 and (.classifications | length) > 0' <<<"$sa" >/dev/null \
  || fail "searchAssets.json missing or empty (advanced-search dropdowns)"
echo "ok   searchAssets.json ($(jq '.artists | length' <<<"$sa") artists)"

# Compression: the prod site serves JS brotli and search responses gzipped; an uncompressed stack is a
# silent page-weight regression.
enc() { curl -s -o /dev/null -D - -m 30 -H 'Accept-Encoding: gzip, br' "$@" | tr -d '\r' \
          | awk -F': ' 'tolower($1)=="content-encoding"{print $2}'; }
js=$(curl -sS -m 30 "$BASE/asset-manifest.json" | jq -r '.files["main.js"]')
e=$(enc "$BASE$js"); [ -n "$e" ] || fail "main JS served uncompressed ($js)"
echo "ok   JS compressed ($e)"
e=$(enc -X POST -H 'Content-Type: application/json' -d "{\"body\":$q}" "$BASE/api/search")
[ -n "$e" ] || fail "POST /api/search served uncompressed"
echo "ok   search responses compressed ($e)"

loc=$(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' -m 30 --max-redirs 0 "$BASE/objects/7069")
[[ "$loc" == 301\ */objects/7069/* ]] || fail "canonical redirect /objects/7069 -> '$loc'"
echo "ok   SSR canonical redirect ($loc)"

# The object page's artist link puts raw JSON braces in the query string; the function URL 400s on those
# unless the CloudFront viewer-request function encodes them (-g: send the braces raw, like a browser).
code=$(curl -sg -o /dev/null -w '%{http_code}' -m 30 "$BASE/objects/?qtype=filter&qval={%22advancedFilters%22:{%22Artist%22:{%22Pablo%20Picasso%22:{%22filterType%22:%22Artist%22,%22value%22:%22Pablo%20Picasso%22,%22term%22:%22Pablo%20Picasso%22,%22index%22:1}}}}")
[ "$code" = 200 ] || fail "filter URL with raw braces -> $code"
echo "ok   filter URL with raw braces"

echo "SMOKE OK: $BASE"
