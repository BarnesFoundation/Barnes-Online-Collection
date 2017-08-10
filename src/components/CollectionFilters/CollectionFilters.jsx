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

import './collectionFilters.css';

class CollectionFilters extends Component {
  showFilterSet() {
    const slug = this.props.filterSets.visibleFilterSet;
    if (slug === 'search') {
      return <SearchInput />;
    } else if (slug === 'shuffle' || slug === null) {
      return null;
    } else {
      return <CollectionFiltersSet />
    }
  }

  showAppliedFilters() {
    if (this.props.search.length > 0) {
      return <SearchApplied />
    } else if (this.props.filters.length > 0) {
      return <CollectionFiltersApplied />
    } else {
      return null;
    }
  }

  render() {
    return (
      <div>
        <CollectionFiltersMenu />
        {this.showFilterSet()}
        {this.showAppliedFilters()}
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
    FilterSetsActions
  ),
  dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionFilters);
