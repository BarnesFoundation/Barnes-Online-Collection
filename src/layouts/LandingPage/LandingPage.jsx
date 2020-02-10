import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router'
import queryString from 'query-string';
import { getAllObjects } from '../../actions/objects';
import { addSearchTerm } from '../../actions/search';
import { setFilters } from '../../actions/filters';
import { closeFilterSet } from '../../actions/filterSets';
import { getMetaTagsFromObject, getQueryKeywordUrl, getQueryFilterUrl} from '../../helpers';
import LandingPageHeader from './LandingPageHeader';
import SiteHeader from '../../components/SiteHeader/SiteHeader';
import SiteHtmlHelmetHead from '../../components/SiteHtmlHelmetHead';
import HtmlClassManager from '../../components/HtmlClassManager';
import CollectionFilters from '../../components/CollectionFilters/CollectionFilters';
import ArtObjectGrid from '../../components/ArtObjectGrid/ArtObjectGrid';
import { Footer } from '../../components/Footer/Footer';
import './landingPage.css';

class LandingPage extends Component {
  constructor(props) {
    super(props);
  }

  /**
   * Parse JSON from querystring and set up search, filters, and advanced filters.
   */
  componentDidMount() {
    const { qtype, qval, } = queryString.parse(this.props.location.search); // Destructure querystring.

    // If there is a querystring, run filtered search.
    if (qval.length) {
      // For filters
      if (qtype === 'filter') {
        let filterSelection = {};
  
        try {
          filterSelection = JSON.parse(qval);
        } catch (e) {
          console.error('Invalid JSON in filter.');
        }
  
        this.props.setFilters(filterSelection);

      // For search
      } else if (qtype === 'keyword') {
        this.props.addSearchTerm(qval);
      }
    } else {
      // Otherwise, get all objects.
      this.props.getAllObjects();
    }
  }

  /**
   * On props update.
   * TODO => This is convoluted and fires on either search, filters, or history changing.  Rewrite this in a more declarative way.
   */
  componentDidUpdate() {
    const {
      search,
      filters,
      history: { location: { state: newState }} // For detecting if a modal is open.
    } = this.props;

    // Detect if we just opened a modal. If so, just return.
    if (newState && newState.isModal) return;

    const { qtype: queryType, qval: queryVal } = queryString.parse(this.props.location.search);

    if (search.length) {
      if (search !== queryVal) this.props.history.push(getQueryKeywordUrl(search));
    } else if (
      (filters.ordered && filters.ordered.length) // If there are ordered filters
      || Object.values(filters.advancedFilters).reduce((acc, advancedFilter) => acc + Object.keys(advancedFilter).length, 0) // Or advanced filters.
      ) {

      // Reduce and stringify filter state to compare with queryVal.
      const filtersVal = JSON.stringify({
        // Convert ordered array into object for higher ordered filters.
        ...filters.ordered.reduce((acc, filter) => ({
          ...acc, [filter.filterType]: filter.value || filter.name, // For lines and colors we just use the name and for space and light we use the value.
        }), {}),

        // Stringify advanced filters
        advancedFilters: filters.advancedFilters,
      });

      if (filtersVal !== queryVal) {
        this.props.history.push(getQueryFilterUrl(filtersVal));
      }
    } else if (queryType) {
      // Else if there is querytype but no filters or search, reset URL to /.
      this.props.history.push('');
    }
  }

  render() {
    const { object, objectsQuery, objects: liveObjects, isFilterActive, closeFilterSet } = this.props;
    const metaTags = getMetaTagsFromObject(object);
    const isSearchPending = Boolean(objectsQuery && objectsQuery.isPending);
    const pageType = 'landing';

    // If filters are active, apply 50% opacity on search results.
    let isBackgroundActiveClasses = 'shaded-background__tint';
    if (isFilterActive) isBackgroundActiveClasses = `${isBackgroundActiveClasses} shaded-background__tint--active`

    return (
      <div className="app app-landing-page">
        <SiteHtmlHelmetHead metaTags={metaTags} />
        <HtmlClassManager />
        <SiteHeader />

        <div className="landing-page">
          {/* Prevent FOUC on mount. */}
          <div style={{ minHeight: '100vh' }}>
            <div className="landing-page-header-wrap">
              <LandingPageHeader />
            </div>

            <div className="m-block m-block--shallow m-block--no-border m-block--flush-top collection-filters-wrap">
              <CollectionFilters />
            </div>
            <div className='shaded-background'>
              {/** Shaded background. */}
              <div
                className={isBackgroundActiveClasses}
                onClick={() => {
                  // TODO => Change this to include mobile filters.
                  closeFilterSet()
                }}>  
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
              <Footer hasHours/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    modalIsOpen: state.modal.modalIsOpen,
    modal: state.modal,
    filters: state.filters,
    search: state.search,

    object: state.object,
    objects: state.objects,
    objectsQuery: state.objectsQuery,
    isFilterActive: Boolean(state.filterSets.visibleFilterSet),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign(
    {},
    {
      //Objects
      getAllObjects, 
      // Search
      addSearchTerm,
      // Filters
      setFilters,
      // FilterSet
      closeFilterSet
    },
  ), dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LandingPage));
