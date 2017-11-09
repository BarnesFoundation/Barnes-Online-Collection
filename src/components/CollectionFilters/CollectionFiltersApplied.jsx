import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ClearAllButton from '../SearchInput/ClearAllButton'
import MobilePanelShuffleButton from './MobilePanelShuffleButton'
import FilterTag from './FilterTag';
import MediaQuery from 'react-responsive';
import { BREAKPOINTS } from '../../constants';

import * as FiltersActions from '../../actions/filters';

class CollectionFiltersApplied extends Component {
  getFilterTags(filters) {
    return filters.map((filter, index) =>
      <FilterTag
        key={index}
        index={index}
        filter={filter}
      />
    );
  }

  render() {
    const filters = this.props.filters.ordered;

    if (!filters) {
      return null;
    }

    const hasFilters = filters.length > 0;

    return ( hasFilters &&
      <div className="applied-filter-tags-container-wrap">
        <div className="flex-left">
          <div className="applied-filter-tags-container">
            {this.getFilterTags(filters)}
          </div>
        </div>
        <div className="flex-right">
          <ClearAllButton />
          <MobilePanelShuffleButton />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    filters: state.filters
  }
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign({},
    FiltersActions,
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionFiltersApplied);
