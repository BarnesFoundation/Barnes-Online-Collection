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
  constructor(props) {
    super(props);
    this.selectFilter = this.selectFilter.bind(this);
  }

  selectFilter(filterName) {
    const slug = filterName.toLowerCase();
    this.props.selectFilterSet(slug);
  }

  render() {
    var visibleFilterSet = this.props.filters.visibleFilterSet,
      visibleFilter;

    switch(visibleFilterSet) {
      case 'search':
        visibleFilter = <SearchInput />;
        break;
      case 'colors':
      case 'lines':
      case 'light':
      case 'space':
        visibleFilter = <CollectionFiltersSet visibleFilterSet={visibleFilterSet} title={visibleFilterSet} />;
        break;
      case 'shuffle':
      default:
        visibleFilter = null;
        break;
    }

    return (
      <div>
        <CollectionFiltersMenu
          visibleFilterSet={visibleFilterSet}
          selectFilter={this.selectFilter}
        />
        {visibleFilter}
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
  return bindActionCreators(Object.assign({},
    FiltersActions,
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionFiltersPanel);
