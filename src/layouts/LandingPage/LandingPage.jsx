import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ObjectActions from '../../actions/object';
import * as UIActions from '../../actions/ui';
import LandingPageHeader from './LandingPageHeader';
import SiteHeader from '../../components/SiteHeader/SiteHeader';
import SiteHtmlHelmetHead from '../../components/SiteHtmlHelmetHead';
import HtmlClassManager from '../../components/HtmlClassManager';
import CollectionFilters from '../../components/CollectionFilters/CollectionFilters';
import ArtObjectGrid from '../../components/ArtObjectGrid/ArtObjectGrid';
import Modal from '../../components/Modal';
import ArtObjectPageShell from '../../components/ArtObjectPageComponents/ArtObjectPageShell';
import Footer from '../../components/Footer/Footer';

import './landingPage.css';

class LandingPage extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="app app-landing-page">
        <SiteHtmlHelmetHead />
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
              pageType="landing"
            />
          </div>
        </div>

        { this.props.modalIsOpen &&
          <Modal>
            <ArtObjectPageShell
              slug=""
            />
          </Modal>
        }
        <Footer />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    object: state.object,
    modalIsOpen: state.ui.modalIsOpen,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign(
    {},
    UIActions,
    ObjectActions,
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);
