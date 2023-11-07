// Environment variables prefixed with `REACT_APP`
module.exports = {
    // URLs related to main website and collection host
    mainWebsiteURL:  process.env.REACT_APP_WWW_URL || '//www.barnesfoundation.org',
    canonicalRoot: process.env.REACT_APP_CANONICAL_ROOT || 'https://collection.barnesfoundation.org',
    newsletterURL: process.env.REACT_APP_NEWSLETTER_URL,


    // Image related values
    awsBucket:  process.env.REACT_APP_AWS_BUCKET || '',
    imagesPrefix: process.env.REACT_APP_IMAGES_PREFIX || '',
    imageBaseURL:  process.env.REACT_APP_IMAGE_BASE_URL || `//s3.amazonaws.com/${process.env.REACT_APP_AWS_BUCKET || ''}`,

    googleAnalyticsID: process.env.REACT_APP_GOOGLE_ANALYTICS_ID || '',
    printsEndpoint: process.env.REACT_APP_PRINTS_ENDPOINT || 'https://prints.barnesfoundation.org/utility/object_reference_uri',
}