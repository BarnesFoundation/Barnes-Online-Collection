// CRACO config — minimal override for the Node 24 / react-scripts 5 upgrade (CS-64).
//
// Under CRA 5 / webpack 5, css-loader resolves root-absolute `url(/…)` references at build time.
// Our vendored toolkit CSS references fonts (and images) that are served from `public/` via absolute
// paths (e.g. `url("/fonts/CalibreWeb-Regular.woff2")`). Those resolve at runtime from public/ and
// worked fine under CRA 3 (webpack 4). Tell css-loader to leave root-absolute / protocol / data URLs
// alone so the build doesn't try to bundle them (only the .woff2 variants exist in src; the full
// .woff/.eot/.ttf/.svg set lives in public/fonts/).
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const keepRuntimeUrls = (rules) => {
        for (const rule of rules) {
          if (rule.oneOf) keepRuntimeUrls(rule.oneOf);
          const uses = Array.isArray(rule.use) ? rule.use : [];
          for (const u of uses) {
            // NB: match the /css-loader/ path segment — "postcss-loader" also contains "css-loader".
            if (u && typeof u === "object" && u.loader && u.loader.includes("/css-loader/") && u.options) {
              u.options.url = {
                filter: (url) =>
                  !(url.startsWith("/") || url.startsWith("http") || url.startsWith("data:")),
              };
            }
          }
        }
      };
      keepRuntimeUrls(webpackConfig.module.rules);
      return webpackConfig;
    },
  },
};
