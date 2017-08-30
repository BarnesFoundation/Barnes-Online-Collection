import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import FilterTag from './FilterTag';

import * as FiltersActions from '../../actions/filters';

class CollectionFiltersApplied extends Component {
  filterTags() {
    return this.props.filters.ordered.map((filter, index) =>
      <FilterTag
        key={index} index={index}
        displayType={filter.displayType}
        displayValue={filter.displayValue}
        method={filter.method}
        type={filter.type}
        field={filter.field}
        term={filter.term}
      />
    );
  }

  render() {
    return (
      <div>
        {this.filterTags()}
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
