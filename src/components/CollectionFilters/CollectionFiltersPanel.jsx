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

  setVisibleFilter(slug) {
    switch(slug) {
      case 'search':
        return <SearchInput />;
      case 'colors':
      case 'lines':
      case 'light':
      case 'space':
        return <CollectionFiltersSet visibleFilterSet={slug} title={slug} />;
        break;
      case 'shuffle':
      default:
        return null;
    }
  }

  render() {
    const visibleFilterSet = this.props.filters.visibleFilterSet;
    return (
      <div>
        <CollectionFiltersMenu
          visibleFilterSet={visibleFilterSet}
          selectFilter={this.selectFilter}
        />
        {this.setVisibleFilter(visibleFilterSet)}
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
