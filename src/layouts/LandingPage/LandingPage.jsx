import React, { Component } from 'react';
import { connect } from 'react-redux';

import LandingPageHeader from './LandingPageHeader';
import SiteHeader from '../../components/SiteHeader/SiteHeader';
import HtmlClassManager from '../../components/HtmlClassManager';

import CollectionFiltersPanel from '../../components/CollectionFilters/CollectionFiltersPanel';

import ArtObjectGrid from '../../components/ArtObjectGrid/ArtObjectGrid';

import Footer from '../../components/Footer/Footer';

class LandingPage extends Component {
  render() {
    return (
      <div className="app">
        <HtmlClassManager />
        <SiteHeader />
        <h1>LandingPage</h1>
        <LandingPageHeader />
        <CollectionFiltersPanel />
        <ArtObjectGrid history={this.props.history}/>
        <Footer />
      </div>
    );
  }
}

export default connect()(LandingPage);
