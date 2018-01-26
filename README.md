# Barnes Collection Online

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## Development Installation
1. Clone this repository.
2. `$ npm install`
3. You'll also want the following installed on your machine:
  - Elasticsearch:
    ```bash
    brew install elasticsearch@5.6
    brew services start elasticsearch@5.6
    ```
  - Kibana:
    ```bash
    brew install kibana@5.6
    brew services start kibana@5.6
    ```
  - [`git-crypt`](https://www.agwa.name/projects/git-crypt/):
    ```bash
    brew install git-crypt
    ```
4. Copy `.env-example` to a new file `.env` in the root directory. You will need to define each of the environment variables included in the sample file. You can alternatively find a completed `.env` file in the copy of this project repo on the Barnes admin server.
5. `$ npm run build` to build the app.
6. `$ npm start` to run the app.

## Production Installation
1. Clone this repository
2. `$ npm install`
3. Create a `.env` file as above
4. Create a `.htpasswd` file with a username and encrypted password in the root of this directory, using `htpasswd`
5. `$ npm run build`
6. `$ npm install -g pm2`
7. `$ pm2 start ecosystem.json`

## Technical Stack

This project uses everything included with create-react-app, plus Redux, React Router, and other smaller dependencies.

This project assumes you have a separate Elasticsearch instance with the collection data and an S3 bucket with the images, following the [Flickr](https://www.flickr.com/services/api/misc.urls.html) convention.

## API

This project wraps all calls to Elasticsearch in its own API. It uses the `elasticsearch` npm module and has the following routes:

`GET /api/objects/:object_id` returns the art object matching the `:object_id`

`GET /api/search` returns 10 art objects matching a query `q`, which is formatting according to [this documentation](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-search)

`POST /api/objects/:object_invno/download` returns a signed object url upon submitting the Wufoo form with the necessary fields.

## Sitemap generation

The `npm run build-sitemap` helper script re-generates the sitemap.xml file. The script hits the api endpoint and uses the data to template the file. Because the barnes collection never or rarely changes, this should not need to be run regularly.

