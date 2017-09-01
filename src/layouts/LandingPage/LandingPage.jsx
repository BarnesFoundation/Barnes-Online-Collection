import React, { Component } from 'react';
import { connect } from 'react-redux';
import './landingPage.css';
import LandingPageHeader from './LandingPageHeader';
import SiteHeader from '../../components/SiteHeader/SiteHeader';
import HtmlClassManager from '../../components/HtmlClassManager';

import CollectionFilters from '../../components/CollectionFilters/CollectionFilters';

import ArtObjectGrid from '../../components/ArtObjectGrid/ArtObjectGrid';

import Footer from '../../components/Footer/Footer';

class LandingPage extends Component {
  render() {
    return (
      <div className="app app-landing-page">
        <HtmlClassManager />
        <SiteHeader />
        <div className="landing-page container">
          <div className="landing-page-header-wrap m-block m-block--no-border m-block--shallow">
            <LandingPageHeader />
          </div>
          <div className="collection-filters-wrap m-block m-block--flush m-block--shallow m-block--no-border">
            <CollectionFilters />
          </div>
          <div className="art-object-grid-wrap m-block m-block--shallow m-block--no-border">
            <ArtObjectGrid
              history={this.props.history}
              gridStyle="full-size"
            />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default connect()(LandingPage);
