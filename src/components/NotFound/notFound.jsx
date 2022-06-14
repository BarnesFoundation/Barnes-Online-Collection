import React from "react";
import { SiteHeader } from '../SiteHeader/SiteHeader';
import { Footer } from '../Footer/Footer';
import './notFound.scss'

export default class NotFound extends React.Component {
  render() {    

    return (
        <div className='app app-not-found-page' id="not-found">
          <SiteHeader isNotFound />
          <div className="not-found container">
            <br/>
            <h1>Don’t be afraid — you are definitely not lost.</h1>
            <p>
              The page you are looking for is not available. It may have expired or
              moved. How about visiting our <a href="/">collection homepage</a> or{" "}
              <a href="https://barnesfoundation.org/">main site</a>?
            </p>
            <br/>
          </div>
          <br/>
          <Footer hasHours/>
        </div>
    );
  }
};