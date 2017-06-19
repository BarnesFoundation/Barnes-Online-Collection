# Barnes Collection Online 

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## Development Installation
1. Clone this repository.
2. `$ npm install`
3. Create a file in the root of the repository directory called `.env` with the following environment variables defined:
```bash
ELASTICSEARCH_HOST=<url_of_the_elasticsearch_instance>
ELASTICSEARCH_USERNAME=<username_for_es_instance>
ELASTICSEARCH_PASSWORD=<password_for_es_instance>
ELASTICSEARCH_PORT=<port_for_es_instance>
ELASTICSEARCH_PROTOCOL=<protocol_for_es_instance> # (probably http or https)
AWS_BUCKET=<s3_bucket_for_all_images>
AWS_REGION=<region_for_s3_bucket>
AWS_ACCESS_KEY=<aws_access_key>
AWS_SECRET_KEY=<aws_secret_access_key>

# all variables accessible in react app must be prefixed by REACT_APP_
REACT_APP_AWS_BUCKET=<same_as_aws_bucket>
REACT_APP_IMAGES_PREFIX=<directory_for_images_within_bucket>
REACT_APP_PRINTS_ENDPOINT=<url_for_json_map_from_accession_number_to_print_url>
```
4. `$ npm start` to run the app

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
