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
import { Footer } from '../../components/Footer/Footer';

import './landingPage.css';

class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.routerSearchQueryHelper.runSearchQueryOrDeferredFetch(this.props.getAllObjects);
  }

  render() {
    const object = this.props.object;
    const metaTags = getMetaTagsFromObject(object);
    const queryState = this.props.objectsQuery || {};
    const isSearchPending = queryState.isPending;
    const liveObjects = this.props.objects;
    const pageType = 'landing';

    return (
      <div className="app app-landing-page">
        <SiteHtmlHelmetHead metaTags={metaTags} />
        <HtmlClassManager />
        <RouterSearchQueryHelper onRef={ref => (this.routerSearchQueryHelper = ref)} />
        <SiteHeader />

        <div className="landing-page">
          {/* Prevent FOUC on mount. */}
          <div style={{ minHeight: '100vh' }}>
            <div className="landing-page-header-wrap">
              <LandingPageHeader />
            </div>

            <div className="collection-filters-wrap m-block m-block--shallow m-block--no-border m-block--flush-top">
              <CollectionFilters />
            </div>
              <ArtObjectGrid
                gridStyle="full-size"
                shouldLinksUseModal={true}
                modalPreviousLocation="/"
                isSearchPending={isSearchPending}
                liveObjects={liveObjects}
                pageType={pageType}
                hasMoreResults
              />
          </div>
        </div>
        <Footer hasHours/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    object: state.object,
    objects: state.objects,
    objectsQuery: state.objectsQuery,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign(
    {},
    ObjectsActions,
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);
