import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { BREAKPOINTS, CLASSNAME_MOBILE_PANEL_OPEN } from '../../constants';

import CollectionFiltersMenu from './CollectionFiltersMenu';
import CollectionFiltersSet from './CollectionFiltersSet';
import SearchInput from '../SearchInput/SearchInput';
import CollectionFiltersApplied from './CollectionFiltersApplied';
import SearchApplied from '../SearchInput/SearchApplied';

import MobileFiltersMenu from './MobileFiltersMenu';
import MobileSearchMenu from './MobileSearchMenu';
import MobileFiltersOpener from './MobileFiltersOpener';
import MobilePanelCloser from './MobilePanelCloser';

import * as FiltersActions from '../../actions/filters';
import * as SearchActions from '../../actions/search';
import * as FilterSetsActions from '../../actions/filterSets';
import * as MobileFiltersActions from '../../actions/mobileFilters';
import * as MobileSearchActions from '../../actions/mobileSearch';
import * as ObjectsActions from '../../actions/objects';
import * as HtmlClassManagerActions from '../../actions/htmlClassManager';

import './collectionFilters.css';

class CollectionFilters extends Component {
  getFilterSet() {
    const slug = this.props.filterSets.visibleFilterSet;
    if (slug === 'search') {
      return <SearchInput />;
    } else if (slug === 'shuffle' || slug === null) {
      return null;
    } else {
      return <CollectionFiltersSet />
    }
  }

  hasNewSearch(props) {
    return props.search.length > 0 &&
      props.search !== this.props.search;
  }

  hasNewFilters(props) {
    return props.filters.ordered.length > 0 &&
      props.filters.ordered !== this.props.filters.ordered;
  }

  hasBeenReset(props) {
    const hasNothingSet = props.search.length === 0 && props.filters.ordered.length === 0;
    const searchHasChanged = props.search !== this.props.search;
    const filtersHaveChanged = props.filters.ordered !== this.props.filters.ordered;

    return hasNothingSet && (
      searchHasChanged || filtersHaveChanged
    );
  }

  inMobileFilterMode(props) {
    return props.mobileFilters.visible;
  }

  inMobileSearchMode(props) {
    return props.mobileSearch.visible;
  }

  mobileFiltersApplied(props) {
    return props.mobileFilters.filtersApplied;
  }

  componentWillReceiveProps(nextProps) {
    const mobileFiltersWasOpen = this.inMobileFilterMode(this.props);
    const mobileFiltersWillBeOpen = this.inMobileFilterMode(nextProps);
    const mobileSearchWillBeOpen = this.inMobileSearchMode(nextProps);

    // this will keep these html class states correct.
    if (mobileFiltersWillBeOpen || mobileSearchWillBeOpen) {
      this.props.htmlClassesAdd(CLASSNAME_MOBILE_PANEL_OPEN);
    } else {
      this.props.htmlClassesRemove(CLASSNAME_MOBILE_PANEL_OPEN);
    }

    // if a search was just submitted
    if (this.hasNewSearch(nextProps)) {
      this.props.searchObjects(nextProps.search);
      this.props.clearAllFilters();
      this.props.closeFilterSet();
      this.props.closeMobileFilters();
      this.props.closeMobileSearch();
      return;
    }

    // if it's been reset
    if (this.hasBeenReset(nextProps)) {
      this.props.getAllObjects();
      this.props.closeMobileFilters();
      this.props.closeMobileSearch();
      return;
    }

    if (mobileFiltersWasOpen) {
      // if we're editing mobile filters
      if (mobileFiltersWillBeOpen) {
        // if we've changed something about the filters
        if (this.props.filters.ordered !== nextProps.filters.ordered) {
          // queue the change and move on
          this.props.queueMobileFilters(nextProps.filters.ordered);
        }

        return;
      }

      // if we are closing the mobile filters
      if (!mobileFiltersWillBeOpen) {

        // by hitting the apply button
        if (this.mobileFiltersApplied(nextProps)) {

          // if no changes are pending, do nothing
          if (!this.props.mobileFilters.filtersPending) {
            return;

          // if there are changes pending
          } else {

            // if they're added filters, find the filtered objects
            if (nextProps.filters.ordered.length) {
              this.props.findFilteredObjects(nextProps.filters);
              this.props.clearSearchTerm();

            // if they're cleared filters, get everything
            } else {
              this.props.getAllObjects();
            }
          }

          // this.props.resetMobileFilters();

        // if we've closed the filter panel without hitting the apply button, do nothing
        } else {
          return;
        }
      }
      // end
      return;
    }

    // if we're just opening the mobile panel for the first time
    if (mobileFiltersWillBeOpen) {
      return;
    }

    // otherwise, we're not in mobile search land, handle the new filter
    if (this.hasNewFilters(nextProps)) {
      this.props.findFilteredObjects(nextProps.filters);
      this.props.clearSearchTerm();
      return;
    }
  }

  render() {
    let filtersApplied;

    if (this.props.search.length > 0) {
      filtersApplied = <SearchApplied />;
    } else {
      filtersApplied = <CollectionFiltersApplied visible={!!this.props.filterSets.visibleFilterSet} />;
    }

    const mobileFiltersVisible = this.props.mobileFilters.visible;
    const mobileSearchVisible = this.props.mobileSearch.visible;
    const filterSet = this.getFilterSet();

    return (
      <div className="collection-filters">
        <MediaQuery maxWidth={BREAKPOINTS.tablet_max}>
          { mobileFiltersVisible &&
            <div>
              <MobileFiltersMenu />
              <MobilePanelCloser />
            </div>
          }
          { mobileSearchVisible &&
            <div>
              <MobileSearchMenu />
              <MobilePanelCloser />
            </div>
          }
          { !(mobileFiltersVisible || mobileSearchVisible) &&
            <MobileFiltersOpener />
          }
        </MediaQuery>
        <MediaQuery minWidth={BREAKPOINTS.tablet_max + 1}>
            <CollectionFiltersMenu />
            <div className="m-block m-block--flush">
              {filterSet}
              {filtersApplied}
            </div>
        </MediaQuery>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    filterSets: state.filterSets,
    mobileFilters: state.mobileFilters,
    mobileSearch: state.mobileSearch,
    filters: state.filters,
    search: state.search,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign({},
    FiltersActions,
    SearchActions,
    FilterSetsActions,
    MobileFiltersActions,
    MobileSearchActions,
    ObjectsActions,
    HtmlClassManagerActions,
  ),
  dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionFilters);
