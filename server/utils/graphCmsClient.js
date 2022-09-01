const { GraphQLClient } = require("graphql-request");

const graphQLClient = new GraphQLClient(process.env.GRAPHCMS_ENDPOINT)

module.exports = graphQLClient;