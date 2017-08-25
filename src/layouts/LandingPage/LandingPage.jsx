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
      <div className="app">
        <HtmlClassManager />
        <SiteHeader />
        <div className="container">
          <div className="m-block m-block--no-border">
            <LandingPageHeader />
          </div>
          <div className="collection-filters-wrap m-block m-block--flush m-block--shallow m-block--no-border">
            <CollectionFilters />
          </div>
          <div className="m-block m-block--shallow m-block--no-border">
            <ArtObjectGrid history={this.props.history}/>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default connect()(LandingPage);
