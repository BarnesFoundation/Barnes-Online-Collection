/* CS-84: the analytics gate and event shaping. jsdom runs on "localhost", which the tests use as the
 * analytics host when they want tracking on. */

const load = (env) => {
  let mod;
  const saved = { ...process.env };
  Object.assign(process.env, env);
  jest.isolateModules(() => {
    mod = require("./analytics");
  });
  process.env = saved;
  return mod;
};

const ON = { REACT_APP_GA4_MEASUREMENT_ID: "G-TEST", REACT_APP_ANALYTICS_HOST: "localhost" };

const sent = () =>
  (window.dataLayer || [])
    .map((args) => Array.from(args))
    .filter(([cmd]) => cmd === "event")
    .map(([, name, params]) => ({ name, params }));

beforeEach(() => {
  delete window.dataLayer;
  delete window.gtag;
});

test("sends nothing without a measurement id", () => {
  const a = load({ REACT_APP_GA4_MEASUREMENT_ID: "", REACT_APP_ANALYTICS_HOST: "localhost" });
  a.trackEvent("view_item", { object_id: "1" });
  expect(sent()).toEqual([]);
});

test("sends nothing off the analytics host (previews, dev, origin hostnames)", () => {
  const a = load({ REACT_APP_GA4_MEASUREMENT_ID: "G-TEST", REACT_APP_ANALYTICS_HOST: "collection.barnesfoundation.org" });
  a.trackEvent("view_item", { object_id: "1" });
  expect(sent()).toEqual([]);
});

test("queues events as gtag Arguments and drops empty params", () => {
  const a = load(ON);
  a.trackEvent("view_item", { object_id: "5187", artist: "", object_title: undefined });
  expect(sent()).toEqual([{ name: "view_item", params: { object_id: "5187" } }]);
  expect(Object.prototype.toString.call(window.dataLayer[0])).toBe("[object Arguments]");
});

test("truncates string params to GA4's 100 characters", () => {
  const a = load(ON);
  a.trackEvent("search", { search_term: "x".repeat(150) });
  expect(sent()[0].params.search_term).toHaveLength(100);
});

test("filter_apply uses the visitor-facing filter names and skips search", () => {
  const a = load(ON);
  a.trackFilterApply({ filterType: "colors", name: "red" });
  a.trackFilterApply({ filterType: "Artist", value: "Pablo Picasso", term: "Pablo Picasso" });
  a.trackFilterApply({ filterType: "search", value: "dog" });
  expect(sent()).toEqual([
    { name: "filter_apply", params: { filter_type: "color", filter_value: "red" } },
    { name: "filter_apply", params: { filter_type: "artist", filter_value: "Pablo Picasso" } },
  ]);
});

test("search fires once per new term; zero_results lists the filters in play", () => {
  const a = load(ON);
  const withSearch = { ordered: [{ filterType: "search", value: "dog" }], advancedFilters: {} };
  a.trackResults(withSearch, 12);
  a.trackResults(withSearch, 12); // same term again (e.g. a filter added on top): no repeat
  a.trackResults(
    {
      ordered: [{ filterType: "search", value: "dog" }, { filterType: "lines" }],
      advancedFilters: { Year: { dateRange: {} }, Room: {} },
    },
    0
  );
  expect(sent()).toEqual([
    { name: "search", params: { search_term: "dog", results_count: 12 } },
    { name: "zero_results", params: { search_term: "dog", filter_types: "line,date" } },
  ]);
});

test("a failed request reports nothing", () => {
  const a = load(ON);
  a.trackResults({ ordered: [{ filterType: "search", value: "dog" }] }, null);
  expect(sent()).toEqual([]);
});
