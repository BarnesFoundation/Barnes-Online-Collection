/**
 * GA4 + Hotjar for the collection site (CS-84). Modelled on VXP's analytics module (vxp-2.0 PR #471).
 *
 * Nothing is sent unless BOTH are true:
 *  - the build has a measurement id (REACT_APP_GA4_MEASUREMENT_ID; only the prod workflow sets it), and
 *  - the page is on the production host (`ui.analyticsHost`).
 * The same prod bundle is also reachable on its CloudFront and Lambda origin hostnames, and PR previews,
 * dev and localhost must never land in the figures used to judge a release, so the host check is not optional.
 *
 * Every event carries `build_id` as a user property (set once in `initAnalytics`), so any report can be
 * split before/after a release. It is the release tag plus the short commit, e.g. `v2.0.4+21eca23`.
 */
import { ui } from "./shared/config";

/**
 * Every event this site sends and its parameters. Names describe what the collection site does; GA4's
 * recommended names (`search`, `view_item`, `share`, `file_download`) are used where one fits.
 * Add an event here before sending it: an unlisted parameter has no custom dimension to land in.
 *
 * - search           { search_term, results_count }        a search returned its first page of results
 * - zero_results     { search_term, filter_types }         a search or filter combination found nothing
 * - filter_apply     { filter_type, filter_value }         a visitor turned a filter on
 * - view_item        { object_id, object_title, artist }   an object page was shown
 * - image_zoom       { object_id }                         first zoom into an object's deep-zoom image
 * - request_image_start { object_id, request_type }        clicked Request Image / Download Image
 *                                                          (request_type: "publication" | "download")
 * - share            { method, object_id }                 picked a share option
 * - file_download    { object_id, file_name }              sent server-side when the download link is used
 *                                                          (see server/analytics.js)
 */

const PARAM_MAX = 100; // GA4 truncates event parameter values at 100 characters

const enabled = () =>
  typeof window !== "undefined" &&
  Boolean(ui.ga4MeasurementId) &&
  window.location.hostname === ui.analyticsHost;

/**
 * `window.gtag`, defining the standard queueing stub if gtag.js hasn't loaded yet. It must push
 * `arguments`, not an array: gtag.js only treats an Arguments object as a command, and an array would be
 * filed as plain data-layer data and never sent.
 */
const gtag = () => {
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    };
  }
  return window.gtag;
};

const clean = (params) => {
  const out = {};
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    out[k] = typeof v === "string" ? v.slice(0, PARAM_MAX) : v;
  });
  return out;
};

let initialized = false;

/** Load gtag.js and Hotjar once, tagged with the build. Call once at startup; a no-op off production. */
export const initAnalytics = () => {
  if (initialized || !enabled()) return;
  initialized = true;

  const g = gtag();
  g("js", new Date());
  g("set", "user_properties", { build_id: ui.buildId });
  // Page views are sent explicitly per route (see trackPageView): this is a single-page app, so the
  // automatic page_view would only ever count the first page.
  g("config", ui.ga4MeasurementId, { send_page_view: false });

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${ui.ga4MeasurementId}`;
  document.head.appendChild(s);

  if (ui.hotjarId) loadHotjar();
};

/**
 * Hotjar's bootstrap, tagged with the build so recordings and heatmaps split by release too. The user id
 * is null on purpose: there is nothing about a visitor this needs to know.
 */
const loadHotjar = () => {
  window.hj =
    window.hj ||
    function hj() {
      // eslint-disable-next-line prefer-rest-params
      (window.hj.q = window.hj.q || []).push(arguments);
    };
  window._hjSettings = { hjid: Number(ui.hotjarId), hjsv: 6 };
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://static.hotjar.com/c/hotjar-${ui.hotjarId}.js?sv=6`;
  document.head.appendChild(s);
  window.hj("identify", null, { build_id: ui.buildId });
};

/** Send one event from the list above. */
export const trackEvent = (name, params) => {
  if (!enabled()) return;
  gtag()("event", name, clean(params));
};

/** Send a page_view for a route change. */
export const trackPageView = (path) => {
  if (!enabled()) return;
  gtag()("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
};

// Filter types as the visitor sees them, rather than the code's internal names.
const FILTER_TYPE_NAMES = { colors: "color", lines: "line", year: "date" };

export const filterTypeName = (filterType) => {
  const t = String(filterType || "").toLowerCase();
  return FILTER_TYPE_NAMES[t] || t;
};

/** filter_apply for a filter a visitor just added. Search terms are reported as `search` instead. */
export const trackFilterApply = (filter) => {
  if (!filter || filter.filterType === "search") return;
  const value = filter.term || filter.name || filter.value;
  trackEvent("filter_apply", {
    filter_type: filterTypeName(filter.filterType),
    filter_value: Array.isArray(value) ? value.join("-") : String(value ?? ""),
  });
};

let lastSearchTerm = null;

/**
 * search (once per new term) and zero_results, from the first page of a filtered/search query.
 * `filters` is the redux filters state; `total` the hit count, or null when the request failed.
 */
export const trackResults = (filters, total) => {
  if (total === null || total === undefined) return;
  const ordered = (filters && filters.ordered) || [];
  const search = ordered.find((f) => f.filterType === "search");
  const searchTerm = search ? String(search.value) : "";

  if (searchTerm && searchTerm !== lastSearchTerm) {
    trackEvent("search", { search_term: searchTerm, results_count: total });
  }
  lastSearchTerm = searchTerm || null;

  if (total === 0) {
    const types = [
      ...ordered.filter((f) => f.filterType !== "search").map((f) => filterTypeName(f.filterType)),
      ...Object.entries((filters && filters.advancedFilters) || {})
        .filter(([, applied]) => applied && Object.keys(applied).length)
        .map(([type]) => filterTypeName(type)),
    ];
    trackEvent("zero_results", {
      search_term: searchTerm,
      filter_types: [...new Set(types)].join(","),
    });
  }
};
