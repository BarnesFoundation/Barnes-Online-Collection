# Analytics

The collection site reports to two services, and only from production.

| Service | What it answers                                         | Switched on by                                    |
| ------- | ------------------------------------------------------- | ------------------------------------------------- |
| GA4     | What visitors do: searches, filters, objects, downloads | repo variable `COLLECTION_GA4_MEASUREMENT_ID`     |
| Hotjar  | How it felt: recordings and heatmaps                    | repo variable `COLLECTION_HOTJAR_ID`              |

Both ids are GitHub repository variables (Settings → Secrets and variables → Actions → Variables). Only the
prod deploy reads them, so they take effect from the next release. Even in a prod build, nothing is sent
unless the page is on `collection.barnesfoundation.org`. The same build is also reachable on its CloudFront
and Lambda hostnames, and dev, PR previews and localhost never send anything.

Code: [`src/analytics.js`](src/analytics.js) (browser) and [`server/analytics.js`](server/analytics.js)
(the server-side download event).

## Comparing releases

Every event carries **`build_id`**, a user property set to the release tag plus the short commit, e.g.
`v2.0.4+21eca23`. Hotjar gets the same value through `identify`. To see a release's effect, split any
report by `build_id`.

## Events

| Event                 | Sent when                                                   | Parameters                             |
| --------------------- | ----------------------------------------------------------- | -------------------------------------- |
| `page_view`           | Each route change (this is a single-page app)               | `page_path`                            |
| `search`              | A search returns its first page, once per new term          | `search_term`, `results_count`         |
| `zero_results`        | A search or filter combination finds nothing                | `search_term`, `filter_types`          |
| `filter_apply`        | A visitor turns on a filter                                 | `filter_type`, `filter_value`          |
| `view_item`           | An object page shows its object                             | `object_id`, `object_title`, `artist`  |
| `image_zoom`          | The first zoom gesture on an object's deep-zoom image       | `object_id`                            |
| `request_image_start` | Request Image or Download Image is clicked                  | `object_id`, `request_type`            |
| `share`               | A share option is picked                                    | `method`, `object_id`                  |
| `file_download`       | The download link from the Wufoo image-use form is followed | `object_id`, `file_name` (server-side) |

- `filter_type` uses the names visitors see: `color`, `line`, `light`, `space`, `date`, `artist`, `culture`,
  `category`, `room`, `copyright`.
- `request_type` is `download` (public-domain works, which go to the image-use form) or `publication`
  (the permission-request form).
- **`request_image_submit` can't be sent from the site.** Both forms are on Wufoo, and the publication form
  never sends the visitor back. To count submissions, set that form's confirmation to redirect to a
  collection-site URL, and add an event for it.

To add an event: list it in the comment at the top of `src/analytics.js` first, then send it with
`trackEvent`. An undeclared parameter has no custom dimension to land in.

## One-time console setup (not in code)

**GA4, property COLLECTION (384854370):**
1. Admin → Custom definitions: register `build_id` (user-scoped) and, event-scoped, `object_id`,
   `object_title`, `artist`, `filter_type`, `filter_value`, `search_term`, `results_count`, `filter_types`,
   `request_type`, `method`, `file_name`. An unregistered parameter is accepted, then dropped from reports.
2. Admin → Events: mark `file_download` and `request_image_start` as key events (and
   `request_image_submit`, once it exists).
3. Data stream → Enhanced measurement: turn **off** "Page changes based on browser history events". The
   site sends `page_view` itself, so leaving it on double-counts.
4. Data stream → Measurement Protocol API secrets: create one, and store it as `GA4_API_SECRET` in Secrets
   Manager `barnes-collection-www/prod`. Then set the repo variable `COLLECTION_GA4_SERVER_EVENTS` to `true`
   to turn on server-side `file_download`. Do it in that order: the deploy reads the secret once the
   variable is on, and fails if the secret is missing.
5. Optional: a hostname filter for `collection.barnesfoundation.org`. The code already only sends from there.

**Legacy events ("Click", "Open", "Color", …):** these come from Google Tag Manager container
`GTM-522X585` (loaded in `public/index.html`), which only holds old Universal Analytics click tags. The site
code doesn't send them. They stop when that snippet is removed from the site, or when its tags are unpublished
in GTM.

**Hotjar:** create the site in the Barnes Hotjar org, set its id as `COLLECTION_HOTJAR_ID`, and turn on
heatmaps for `/objects/*` and the search results page.

**Release annotations:** add a GA4 annotation for each prod release (date, PR, ticket). `build_id` gives
the same split inside reports.
