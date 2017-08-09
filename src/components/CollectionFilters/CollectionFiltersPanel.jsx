import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import CollectionFiltersMenu from './CollectionFiltersMenu';
import SearchInput from '../SearchInput/SearchInput';
import CollectionFiltersSet from './CollectionFiltersSet';
import CollectionFiltersApplied from './CollectionFiltersApplied';

import * as FiltersActions from '../../actions/filters';

import './collectionFilters.css';

class CollectionFiltersPanel extends Component {
  setVisibleFilter(slug) {
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
        {this.setVisibleFilter(this.props.filters.visibleFilterSet)}
        <CollectionFiltersApplied />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    filters: state.filters
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign({}), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionFiltersPanel);
