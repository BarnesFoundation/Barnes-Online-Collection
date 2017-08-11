import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import CollectionFiltersMenu from './CollectionFiltersMenu';
import CollectionFiltersSet from './CollectionFiltersSet';
import SearchInput from '../SearchInput/SearchInput';
import CollectionFiltersApplied from './CollectionFiltersApplied';
import SearchApplied from '../SearchInput/SearchApplied';

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
      <div>
        <CollectionFiltersMenu />
        {this.filterSet()}
        {filters}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    filterSets: state.filterSets,
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
