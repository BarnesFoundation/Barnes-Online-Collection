# Barnes Collection Online

This project is a virtual gallery of the Barnes Foundation collection of artworks.  It was bootstrapped using [Create React App](https://github.com/facebookincubator/create-react-app) and is deployed on AWS (CloudFront + Lambda; see [DEPLOY.md](DEPLOY.md)). It uses the following technical stack
- React/Redux for the front end of the site
- NodeJS Express server for the backend API and serving the site build
- ElasticSearch for the database of artwork records and their corresponding meta data
- AWS CloudFront (over an S3 bucket) for artwork images and deep-zoom tiles; imgix is still used for the footer's "More from the collection" images
- Gulp for the legacy Elastic Beanstalk `dist.zip` (the `postbuild` step; not used by the Lambda deploys)

The site only *reads* from ElasticSearch. Dev and prod use separate ElasticSearch clusters; for local development, point `.env` at the dev cluster (the dev host is in `deploy-dev.yml` / `template.yaml`, and the password is in AWS Secrets Manager `barnes-collection-www/dev`).

As of CS-55, the artwork-page **carousel renditions** are read from the V2 collection Postgres (`collection_object.images[]`) instead of being fetched live from NetX. This is also **read-only** — set the `PG_*` variables (see `.env-template`) to point at the shared V2 collection database; there is **no local copy to run**. If the `PG_*` variables are unset, object pages still render (search, tombstone, and the primary image all come from ElasticSearch/CloudFront) — only the alternate/archival carousel renditions will be absent. Renditions are on for dev and off on prod (`EnablePostgresV2=false`) until CS-55 is activated there.

## Requirements

To be able to run this project for local development, your environment will necessitate the following
- Node.js 24 (ships with npm 11) — matches `.nvmrc`; required by react-scripts 5 (CS-64)

Please install the above prior to proceeding further.

## Installation

Clone this repository into your local environment

`git clone https://github.com/BarnesFoundation/Barnes-Online-Collection.git`

Install the necessary dependencies

`npm ci`

Copy `.env-template` to `.env` and fill in the values

Build and run the application
```
    npm run build
    npm run start
```

The `npm run start-dev` command will start the backend API server and the frontend development server both in parallel. This is so that changes can be made to either part and be compiled on the fly.

The advanced-search dropdown options live in `public/resources/searchAssets.json`, which is committed and
refreshed weekly by a GitHub Actions workflow. To regenerate it locally, start the server and run

`curl http://localhost:4002/api/build-search-assets`

## Deployment

See **[DEPLOY.md](DEPLOY.md)**. In short:

- **Dev:** publish a GitHub **pre-release** (tag `v*`, target `main`). It deploys to
  https://dev.collection.barnesfoundation.org.
- **Prod:** promote that same release (untick "pre-release"), then approve the run. It deploys to
  https://collection.barnesfoundation.org.
- Merging to `main` does not deploy anything.

## Backend API Server

As described earlier, the backend API server is built using an Express server written in NodeJS.  

It is possible -- if needed -- to require basic HTTP authentication for a deployment instance of the site. This would come in handy  with a development or testing instance of the site that you don't want accessible to the public but still deployed publicly. 

To achieve this, you just need to create a `.htpasswd` file with username and encrypted password using the `htpasswd` program. (The Lambda deploys don't include a `.htpasswd`, so they don't use this.)


### Useful API Endpoints
This server wraps all calls to Elasticsearch in its own HTTP API. It uses the `elasticsearch` npm module and returns json unless otherwise noted. Some useful routes are:

- `GET /health` health check that the API is up.

- `GET /api/objects/:object_id` returns json of the art object matching the `:object_id`

- `GET /api/search?body=<json>` or `POST /api/search` with `{"body": <json>}` runs an ElasticSearch query ([format](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-search)) and returns the response. Each hit is also enriched with its Postgres V2 carousel renditions where Postgres is configured.

- `GET /api/related` gets json of related objects to a given object. It takes two query parameters - `objectID` and `dissimilarPercent`. `dissimilarPercent` should be a number between 0 and 100.

- `GET /api/latestIndex` grabs the name of the latest complete elasticsearch index.

### Related objects

The meat of the logic of getting related objects is the `getDistance` function in [server/app.js](server/app.js), used by the `/api/related` route. It takes two objects and calculates a euclidean-ish distance between them.

1. Grab 1000 objects from elasticsearch that have at least one field in `MORE_LIKE_THIS_FIELDS` in common with `objectID`
2. Iterate through all `MORE_LIKE_THIS_FIELDS`, and sum the distances using `getDistance`
3. Return random selection of (n * dissimilarPercent) of the furthest objects, and (n * (100 - dissimilarPercent)) of the closest objects.

For keys that are known to be numbers, we just calculate their distance. If the first person in the `people` descriptor don't match, we add 100 to the absolute distance. This makes it so we bias towards similar artists.

Its a very naive approach but works well with the current collection, and much better than elasticsearch's default more_like_this query (which makes it difficult to do 'dissimilar' objects).

## Sitemap generation

The `npm run build-sitemap` helper script re-generates the sitemap.xml file. The script hits the api endpoint and uses the data to template the file. Because the barnes collection never or rarely changes, this should not need to be run regularly.

This project assumes you have a separate Elasticsearch instance with the collection data and an S3 bucket with the images, following the [Flickr](https://www.flickr.com/services/api/misc.urls.html) convention.

## Tours and Eye Spy Scavenger Hunts

Each tour or scavenger hunt requires its own config file. Set up the JSON config files according to the [template](server/constants/tours/template.jsonc), which has comments documenting each attribute. 

To add a tour to the site you will need to add a new JSON config file to the tours folder [server/constants/tours](server/constants/tours/) folder and import it into the [index file](server/constants//tours/index.js). This will add a new page with the slug defined in [index.js](server/constants/tours/index.js) at `/tour/<slug>`. 

To add an Eye Spy Scavenger Hunt, do the same as for a tour but in the [eyeSpy folder](server/constants/tours/eyeSpy/) and [index file](server/constants/tours/eyeSpy/index.js). This will add a new page with the slug defined in [index.js](server/constants/tours/eyeSpy/index.js) at `eye-spy/<slug>`. 


Once the new page has been added, the [sitemap](public/sitemap.xml) should be updated. This can be done either by manually adding the new page, or by releasing the change, running the sitemap script described [above](README.md#sitemap-generation) against the live site, committing the updated `public/sitemap.xml`, and shipping it in the next release (see [DEPLOY.md](DEPLOY.md)).

There should not be any updates required to the client side when a new tour is added. Both the tours and scavenger hunts are set up the same way, but use different templates and endpoints to help differentiate between how the data should be presented.