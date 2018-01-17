import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ObjectsActions from '../../actions/objects';
import {getMetaTagsFromObject} from '../../helpers';
import LandingPageHeader from './LandingPageHeader';
import SiteHeader from '../../components/SiteHeader/SiteHeader';
import SiteHtmlHelmetHead from '../../components/SiteHtmlHelmetHead';
import HtmlClassManager from '../../components/HtmlClassManager';
import RouterSearchQueryHelper from '../../RouterSearchQueryHelper';
import CollectionFilters from '../../components/CollectionFilters/CollectionFilters';
import ArtObjectGrid from '../../components/ArtObjectGrid/ArtObjectGrid';
import Footer from '../../components/Footer/Footer';

import './landingPage.css';

class LandingPage extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  fetchObjects() {
    return this.props.getAllObjects();
  }

  componentDidMount() {
    debugger;
    const hasRouterSearchQuery = this.props.routerSearchQuery.hasInitialized;
    // if there was a router search query, it will have kicked off the objects fetch already
    if (!hasRouterSearchQuery) {
      this.fetchObjects();
    }
  }

  render() {
    const object = this.props.object;
    const metaTags = getMetaTagsFromObject(object);
    const queryState = this.props.objectsQuery || {};
    const isSearchPending = queryState.isPending;
    const hasMoreResults = queryState.hasMoreResults;
    const liveObjects=this.props.objects;
    const pageType = 'landing';

    return (
      <div className="app app-landing-page">
        <SiteHtmlHelmetHead metaTags={metaTags} />
        <HtmlClassManager />
        <RouterSearchQueryHelper />
        <SiteHeader />

        <div className="landing-page container">
          <div className="landing-page-header-wrap m-block m-block--no-border m-block--shallow">
            <LandingPageHeader />
          </div>

          <div className="collection-filters-wrap m-block m-block--shallow m-block--no-border m-block--flush-top">
            <CollectionFilters />
          </div>
          <div className="art-object-grid-wrap m-block m-block--shallow m-block--no-border m-block--flush-top">
            <ArtObjectGrid
              gridStyle="full-size"
              shouldLinksUseModal={true}
              modalPreviousLocation="/"
              isSearchPending={isSearchPending}
              liveObjects={liveObjects}
              pageType={pageType}
              hasMoreResults={hasMoreResults}
            />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    object: state.object,
    objects: state.objects,
    objectsQuery: state.objectsQuery,
    routerSearchQuery: state.routerSearchQuery,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign(
    {},
    ObjectsActions,
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);
