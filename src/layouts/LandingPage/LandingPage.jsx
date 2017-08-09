import React, { Component } from 'react';
import { connect } from 'react-redux';

import Header from './Header';
import CollectionFiltersPanel from '../../components/CollectionFilters/CollectionFiltersPanel';
import ArtObjectGrid from '../../components/ArtObjectGrid/ArtObjectGrid';
import Footer from '../../components/Footer/Footer';

class LandingPage extends Component {
  render() {
    return (
      <div className="app">
        <h1>LandingPage</h1>
        <Header />
        <CollectionFiltersPanel />
        <ArtObjectGrid history={this.props.history}/>
        <Footer />
      </div>
    );
  }
}

export default connect()(LandingPage);
