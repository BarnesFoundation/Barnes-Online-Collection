// Environment variables prefixed with `REACT_APP`
module.exports = {
  // URLs related to main website and collection host
  mainWebsiteURL: process.env.REACT_APP_WWW_URL || "//www.barnesfoundation.org",
  canonicalRoot:
    process.env.REACT_APP_CANONICAL_ROOT ||
    "https://collection.barnesfoundation.org",
  newsletterURL: process.env.REACT_APP_NEWSLETTER_URL,

  // NetX instance url
  netxBaseURL: process.env.REACT_APP_NETX_BASE_URL || "",

  // Image related values
  awsBucket: process.env.REACT_APP_AWS_BUCKET || "",
  imagesPrefix: process.env.REACT_APP_IMAGES_PREFIX || "",
  imageBaseURL:
    process.env.REACT_APP_IMAGE_BASE_URL ||
    `//s3.amazonaws.com/${process.env.REACT_APP_AWS_BUCKET || ""}`,

  googleAnalyticsID: process.env.REACT_APP_GOOGLE_ANALYTICS_ID || "",

  // GA4 + Hotjar (CS-84, see src/analytics.js). Only the prod build sets the ids, and events are sent
  // only when the page is on analyticsHost, so previews, dev, localhost and origin hostnames never report.
  ga4MeasurementId: process.env.REACT_APP_GA4_MEASUREMENT_ID || "",
  hotjarId: process.env.REACT_APP_HOTJAR_ID || "",
  analyticsHost:
    process.env.REACT_APP_ANALYTICS_HOST || "collection.barnesfoundation.org",
  // The release tag + short commit the bundle was built from (set by the deploy workflows).
  buildId: process.env.REACT_APP_BUILD_ID || "local",
  printsEndpoint:
    process.env.REACT_APP_PRINTS_ENDPOINT ||
    "https://prints.barnesfoundation.org/utility/object_reference_uri",
};
