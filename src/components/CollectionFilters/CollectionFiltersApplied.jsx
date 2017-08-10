import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import FilterTag from './FilterTag';

import * as FiltersActions from '../../actions/filters';
import * as ObjectsActions from '../../actions/objects';

class CollectionFiltersApplied extends Component {
  buildFilterTags(filters) {
    return filters.map((filter, index) =>
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

  componentWillUpdate(nextProps) {
    if (this.props.filters.length !== nextProps.filters.length) {
      this.props.findFilteredObjects(nextProps.filters);
    }
  }

  render() {
    return (
      <div>
        {this.buildFilterTags(this.props.filters)}
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
    ObjectsActions
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionFiltersApplied);
