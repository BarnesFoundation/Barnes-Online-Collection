import React from "react";
import { SiteHeader } from "../SiteHeader/SiteHeader";
import SiteHtmlHelmetHead from "../SiteHtmlHelmetHead";
import HtmlClassManager from "../HtmlClassManager";
import Footer from "../Footer/Footer";
import { META_TITLE } from "../../constants";
import "./notFound.scss";

export default class NotFound extends React.Component {
  getMetaTags() {
    const metaTitle = `${META_TITLE} — Not Found`;
    const metaDescription = `Barnes Foundation Collection: Not Found`;

    return {
      title: metaTitle,
      description: metaDescription,
    };
  }

  render() {
    return (
      <div className="app app-not-found-page" id="not-found">
        <SiteHtmlHelmetHead metaTags={this.getMetaTags()} />
        <HtmlClassManager />
        <SiteHeader isNotFound />
        <div className="not-found container">
          <br />
          <h1>Don’t be afraid — you are definitely not lost.</h1>
          <p>
            The page you are looking for is not available. It may have expired
            or moved. How about visiting our <a href="/">collection homepage</a>{" "}
            or <a href="https://barnesfoundation.org/">main site</a>?
          </p>
          <br />
        </div>
        <br />
        <Footer hasHours />
      </div>
    );
  }
}
