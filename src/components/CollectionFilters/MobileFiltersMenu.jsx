import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import CollectionFiltersApplied from './CollectionFiltersApplied';
import SearchInput from '../SearchInput/SearchInput';
import ColorFilters from './ColorFilters';
import LineFilters from './LineFilters';
import LightFilters from './LightFilters';
import SpaceFilters from './SpaceFilters';

class MobileFiltersMenu extends Component {
  render() {
    return (
      <div className="mobile-filters-panel">
        <CollectionFiltersApplied />
        <SearchInput />
        <ColorFilters />
        <LineFilters />
        <LightFilters />
        <SpaceFilters />
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
  return bindActionCreators(Object.assign({}), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MobileFiltersMenu);
