import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import PageHeader from './Header';
import SiteHeader from '../../components/SiteHeader/SiteHeader';
import HtmlClassManager from '../../components/HtmlClassManager';
import CollectionFiltersPanel from '../../components/CollectionFilters/CollectionFiltersPanel';
import ArtObjectGrid from '../../components/ArtObjectGrid/ArtObjectGrid';
import Footer from '../../components/Footer/Footer';

import * as QueryActions from '../../actions/query';
import * as ObjectsActions from '../../actions/objects';

class LandingPage extends Component {

  constructor(props) {
    super(props);

  //   // Landing Page needs to:
  //   // - know all of the queries/tags the user has applied
  //   // - tell the art object grid what objects to display
  }

  render() {
    console.log(this.props.history);
    return (
      <div className="app">
        <HtmlClassManager />
        <SiteHeader />
        <h1>LandingPage</h1>
        <PageHeader />
        <CollectionFiltersPanel />
        <ArtObjectGrid history={this.props.history}/>
        <Footer />
      </div>
    );
  }
}

LandingPage.propTypes = {
  children: PropTypes.element
};

export default LandingPage;
