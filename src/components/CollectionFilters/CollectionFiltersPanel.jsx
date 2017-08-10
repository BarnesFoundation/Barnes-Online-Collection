import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import CollectionFiltersMenu from './CollectionFiltersMenu';
import SearchInput from '../SearchInput/SearchInput';
import CollectionFiltersSet from './CollectionFiltersSet';
import CollectionFiltersApplied from './CollectionFiltersApplied';

import * as FiltersActions from '../../actions/filters';
import * as FilterSetsActions from '../../actions/filterSets';

import './collectionFilters.css';

class CollectionFiltersPanel extends Component {
  showFilter(slug) {
    switch(slug) {
      case 'search':
        return <SearchInput />;
      case 'colors':
      case 'lines':
      case 'light':
      case 'space':
        return <CollectionFiltersSet />;
      case 'shuffle':
      default:
        return null;
    }
  }

  render() {
    return (
      <div>
        <CollectionFiltersMenu />
        {this.showFilter(this.props.filterSets.visibleFilterSet)}
        <CollectionFiltersApplied />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    filterSets: state.filterSets
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign({},
    FilterSetsActions
  ),
  dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionFiltersPanel);
