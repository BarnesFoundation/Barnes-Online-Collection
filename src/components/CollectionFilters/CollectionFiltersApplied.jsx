import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import FilterTag from './FilterTag';

import * as FiltersActions from '../../actions/filters';
import * as FilterSetsActions from '../../actions/filterSets';
import * as ObjectsActions from '../../actions/objects';
import * as SearchActions from '../../actions/search';

class CollectionFiltersApplied extends Component {
  buildFilterTags() {
    return this.props.filters.map((filter, index) =>
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

  componentDidMount() {
    if (this.props.filters.length > 0) {
      this.props.findFilteredObjects(this.props.filters);
    }
  }

  componentWillReceiveProps(nextProps) {
    const nextFilters = nextProps.filters;
    const filters = this.props.filters;

    if (nextFilters.length > 0 && filters !== nextFilters) {
      this.props.findFilteredObjects(nextFilters);
    } else if (nextFilters.length === 0) {
      this.props.getAllObjects();
    }
  }

  render() {
    return this.buildFilterTags();
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
    FilterSetsActions,
    ObjectsActions,
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionFiltersApplied);
