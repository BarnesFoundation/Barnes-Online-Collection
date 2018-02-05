# Barnes Collection Online

This project wraps all calls to Elasticsearch in its own HTTP API. It uses the `elasticsearch` npm module and returns json unless otherwise noted. Some useful routes are:

`GET /health` health check that the api is up.

`GET /api/objects/:object_id` returns json of the art object matching the `:object_id`

`GET /api/search` returns 10 art objects matching a query `q`, which is formatting according to [this documentation](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-search)

`GET /api/related` gets json of related objects to a given object. It takes two query parameters - `objectID` and `dissimilarPercent`. `dissimilarPercent` should be a number between 0 and 100.

`GET /api/latestIndex` grabs the name of the latest complete elasticsearch index.

## Related objects

The meat of the logic of getting related objects is in the [getDistance](https://github.com/BarnesFoundation/barnes-collection-www/blob/master/server/app.js#L338-L364) function called in [server/app.js#L378-L413](https://github.com/BarnesFoundation/barnes-collection-www/blob/master/server/app.js#L378-L413). This function takes two objects, and calculates a euclidean-ish distance between them.

1. Grab 1000 objects from elasticsearch that have at least one field in `MORE_LIKE_THIS_FIELDS` in common with `objectID`
2. Iterate through all `MORE_LIKE_THIS_FIELDS`, and sum the distances using `getDistance`
3. Return random selection of (n * dissimilarPercent) of the furthest objects, and (n * (100 - dissimilarPercent)) of the closest obejcts.

For keys that are known to be numbers, we just calculate their distance. If the first person in the `people` descriptor don't match, we add 100 to the absolute distance. This makes it so we bias towards similar artists.

Its a very naive approach but works well with the current collection, and much better than elasticsearch's default more_like_this query (which makes it difficult to do 'dissimilar' objects).

## Development Installation

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). To get started with a local version:

Clone this repository.

    git clone https://github.com/barnesfoundation/barnes-collection-www && cd $_

Install dependencies

    yarn install

Install and start elasticsearch and kibana 5.6

    brew install elasticsearch@5.6 kibana@5.6
    brew services start elasticsearch@5.6
    brew services start kibana@5.6

Install git-crypt and unencrypt the credentials

    brew install git-crypt
    git-crypt unlock <path/to/barnes.key>

Set the correct environment variables

    cp .env-example .env
    edit .env

Build and run the application

    yarn build
    yarn start

## Production Installation

Same as development installation, except:

After creating the `.env`, create `.htpasswd` file with username and encrypted password using `htpasswd`.
Run the application via `pm2` with `yarn global add pm2 && pm2 start ecosystem.json`
7. `$ pm2 start ecosystem.json`

## Technical Stack

This project uses everything included with create-react-app, plus Redux, React Router, and other smaller dependencies.

## Sitemap generation

The `yarn build-sitemap` helper script re-generates the sitemap.xml file. The script hits the api endpoint and uses the data to template the file. Because the barnes collection never or rarely changes, this should not need to be run regularly.

This project assumes you have a separate Elasticsearch instance with the collection data and an S3 bucket with the images, following the [Flickr](https://www.flickr.com/services/api/misc.urls.html) convention.
