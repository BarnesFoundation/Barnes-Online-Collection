import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import MediaQuery from 'react-responsive';
import { BREAKPOINTS } from '../../constants';

import CollectionFiltersMenu from './CollectionFiltersMenu';
import CollectionFiltersSet from './CollectionFiltersSet';
import SearchInput from '../SearchInput/SearchInput';
import CollectionFiltersApplied from './CollectionFiltersApplied';
import SearchApplied from '../SearchInput/SearchApplied';

import MobileFiltersMenu from './MobileFiltersMenu';
import MobileFiltersOpener from './MobileFiltersOpener';
import MobileFiltersCloser from './MobileFiltersCloser';

import * as FiltersActions from '../../actions/filters';
import * as SearchActions from '../../actions/search';
import * as FilterSetsActions from '../../actions/filterSets';
import * as ObjectsActions from '../../actions/objects';
import * as HitsDisplayedActions from '../../actions/hitsDisplayed';

import './collectionFilters.css';

class CollectionFilters extends Component {
  filterSet() {
    const slug = this.props.filterSets.visibleFilterSet;
    if (slug === 'search') {
      return <SearchInput />;
    } else if (slug === 'shuffle' || slug === null) {
      return null;
    } else {
      return <CollectionFiltersSet />
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.search.length > 0 &&
      nextProps.search !== this.props.search
    ) {
      this.props.searchObjects(nextProps.search);
      this.props.clearAllFilters();
      this.props.closeFilterSet();
      this.props.setLastIndex(0, 25);
    } else if (
      nextProps.filters.ordered &&
      nextProps.filters.ordered.length > 0 &&
      nextProps.filters.ordered !== this.props.filters.ordered
    ) {
      this.props.findFilteredObjects(nextProps.filters);
      this.props.clearSearchTerm();
      this.props.setLastIndex(0, 25);
    } else if (
      (nextProps.search.length === 0 ||
      !nextProps.filters.ordered) &&
      (nextProps.search !== this.props.search ||
      nextProps.filters.ordered !== this.props.filters.ordered)
    ) {
      this.props.getAllObjects();
      this.props.setLastIndex(0, 25);
    }
  }

  render() {
    let filtersApplied = <CollectionFiltersApplied />;
    if (this.props.search.length > 0) {
      filtersApplied = <SearchApplied />;
    }

    const mobileFiltersVisible = this.props.mobileFilters.visible;

    return (
      <div className="collection-filters">
        <MediaQuery maxWidth={BREAKPOINTS.mobile_max}>
          { mobileFiltersVisible &&
            <div>
              <MobileFiltersMenu />
              <MobileFiltersCloser />
            </div>
          }
          { !mobileFiltersVisible &&
            <MobileFiltersOpener />
          }
        </MediaQuery>
        <MediaQuery minWidth={BREAKPOINTS.desktop_min}>
            <CollectionFiltersMenu />
            <div className="m-block m-block--flush">
              {this.filterSet()}
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
    filters: state.filters,
    search: state.search,
    hitsDisplayed: state.hitsDisplayed
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign({},
    FiltersActions,
    SearchActions,
    FilterSetsActions,
    ObjectsActions,
    HitsDisplayedActions
  ),
  dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionFilters);
