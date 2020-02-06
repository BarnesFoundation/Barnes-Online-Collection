import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ClearAllButton from '../SearchInput/ClearAllButton'
import MobilePanelShuffleButton from './MobilePanelShuffleButton'
import FilterTag from './FilterTag';
import * as FiltersActions from '../../actions/filters';

const CollectionFiltersApplied = ({ filters: { ordered }}) => (
  Boolean(ordered.length) && 
    <div className="applied-filter-tags-container-wrap">
      <div className="flex-left">
        <div className="applied-filter-tags-container">
          {ordered.map((filter, index) => (
            <FilterTag
              key={index}
              index={index}
              filter={filter}
            />)
          )}
        </div>
      </div>
      <div className="flex-right">
        <ClearAllButton />
        <MobilePanelShuffleButton />
      </div>
    </div>
);

const mapStateToProps = state => {
  return {
    filters: state.filters
  }
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign({},
    FiltersActions,
  ), dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CollectionFiltersApplied);
