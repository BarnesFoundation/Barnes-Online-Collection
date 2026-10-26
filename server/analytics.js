/**
 * Server-side GA4 events (CS-84), via the GA4 Measurement Protocol.
 *
 * Only `file_download` is sent from here. A download happens when a visitor finishes the Wufoo "image use"
 * form, which sends them to /track/image-download/<image>; that route redirects to the file, so the server
 * is the only place that sees it. The browser sends its `_ga` cookie with that same-site request, so the
 * event joins the visitor's own GA4 session instead of counting as a new user.
 *
 * Off unless GA4_MEASUREMENT_ID and GA4_API_SECRET are both set (prod only, see template.yaml), and it
 * never delays the redirect: the request is fire-and-forget with a short timeout.
 */
const crypto = require("crypto");

const ENDPOINT = "https://www.google-analytics.com/mp/collect";

/** The GA4 client id from a `_ga` cookie ("GA1.1.123456789.1700000000" -> "123456789.1700000000"). */
const clientIdFromCookie = (cookieHeader) => {
  const match = /(?:^|;\s*)_ga=GA\d+\.\d+\.(\d+\.\d+)/.exec(cookieHeader || "");
  return match ? match[1] : null;
};

const sendEvent = (req, name, params) => {
  const measurementId = process.env.GA4_MEASUREMENT_ID;
  const apiSecret = process.env.GA4_API_SECRET;
  if (!measurementId || !apiSecret) return;

  const body = {
    client_id: clientIdFromCookie(req.headers.cookie) || crypto.randomUUID(),
    user_properties: { build_id: { value: process.env.BUILD_ID || "local" } },
    events: [{ name, params }],
  };
  const url = `${ENDPOINT}?measurement_id=${encodeURIComponent(measurementId)}&api_secret=${encodeURIComponent(apiSecret)}`;

  fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(2000),
  }).catch((e) => console.warn(`[analytics] ${name} not sent: ${e.message}`));
};

/** file_download for an image id like "5610_014b0a151d1954e6_o.jpg" (object 5610). */
const trackFileDownload = (req, imageId) =>
  sendEvent(req, "file_download", {
    object_id: String(imageId).split("_")[0],
    file_name: imageId,
  });

module.exports = { trackFileDownload, clientIdFromCookie };
