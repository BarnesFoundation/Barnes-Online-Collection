/**
 * Post-build: make CRA's render-blocking <link rel="stylesheet"> load ASYNCHRONOUSLY.
 *
 * Why it's safe here: the LCP hero is injected as an inline-styled <img> from index.html's <head>
 * (see the static-hero script), so it needs no external CSS to paint — a render-blocking stylesheet
 * only DELAYS that first paint. The stylesheet still loads (preload → onload swaps rel to
 * "stylesheet"), and it lands in ~hundreds of ms, long before React renders the rest of the page
 * (~seconds behind the JS bundle on mobile), so there's no flash of unstyled content for the app
 * content. <noscript> keeps it render-blocking when JS is off.
 *
 * Runs after `react-scripts build` (see package.json "build"), before the postbuild gulp packaging.
 */
const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "build", "index.html");
let html = fs.readFileSync(file, "utf8");
let n = 0;
html = html.replace(/<link\b[^>]*\brel="stylesheet"[^>]*>/g, (tag) => {
  const href = (tag.match(/href="([^"]+)"/) || [])[1];
  if (!href) return tag;
  n += 1;
  return (
    `<link rel="preload" as="style" href="${href}" ` +
    `onload="this.onload=null;this.rel='stylesheet'">` +
    `<noscript>${tag}</noscript>`
  );
});
fs.writeFileSync(file, html);
console.log(`[async-css] made ${n} stylesheet link(s) non-render-blocking in build/index.html`);
