import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import MediaQuery from 'react-responsive';

import CollectionFiltersMenu from './CollectionFiltersMenu';
import CollectionFiltersSet from './CollectionFiltersSet';
import SearchInput from '../SearchInput/SearchInput';
import CollectionFiltersApplied from './CollectionFiltersApplied';
import SearchApplied from '../SearchInput/SearchApplied';

import MobileCollectionFiltersMenu from './MobileCollectionFiltersMenu';
import MobileCollectionFiltersOpener from './MobileCollectionFiltersOpener';
import MobileCollectionFiltersCloser from './MobileCollectionFiltersCloser';

import * as FiltersActions from '../../actions/filters';
import * as SearchActions from '../../actions/search';
import * as FilterSetsActions from '../../actions/filterSets';
import * as ObjectsActions from '../../actions/objects';

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
    if (nextProps.search.length > 0 && nextProps.search !== this.props.search) {
      this.props.searchObjects(nextProps.search);
      this.props.clearAllFilters();
      this.props.closeFilterSet();
    } else if (nextProps.filters.length > 0 && nextProps.filters !== this.props.filters) {
      this.props.findFilteredObjects(nextProps.filters);
      this.props.clearSearchTerm();
    }
  }

  render() {
    let filters = <CollectionFiltersApplied />;
    if (this.props.search.length > 0) {
      filters = <SearchApplied />;
    }

    return (
      <div className="collection-filters">
      <MediaQuery maxWidth={425}>
        { this.props.mobileFilters.visible &&
          <div>
            <MobileCollectionFiltersMenu />
            <MobileCollectionFiltersCloser />
          </div>
        }
        { !this.props.mobileFilters.visible &&
          <MobileCollectionFiltersOpener />
        }
      </MediaQuery>
      <MediaQuery minWidth={426}>
          <CollectionFiltersMenu />
          <div className="m-block m-block--flush">
            {this.filterSet()}
            {filters}
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
    search: state.search
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign({},
    FiltersActions,
    SearchActions,
    FilterSetsActions,
    ObjectsActions
  ),
  dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionFilters);
