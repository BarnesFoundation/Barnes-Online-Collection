import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { META_TITLE, META_DESCRIPTION, CANONICAL_ROOT, META_IMAGE, META_PLACENAME} from '../../constants';

class SiteHtmlHelmetHead extends Component {
  render() {
    const metaTitle = this.props.metaTitle || META_TITLE;
    const metaDescription = this.props.metaDescription || META_DESCRIPTION;
    const metaImage = this.props.metaImage || META_IMAGE;
    const canonicalUrl = CANONICAL_ROOT + window.location.pathname;

    return (
      <Helmet>
        <meta name="title" content={metaTitle} />
        <meta name="description" content={metaDescription} />
        <meta name="geo.placename" content={META_PLACENAME} />

        <title>{metaTitle}</title>

        <meta property="og:type" content="website" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={metaImage} />

        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
    );
  }
}

export default SiteHtmlHelmetHead;