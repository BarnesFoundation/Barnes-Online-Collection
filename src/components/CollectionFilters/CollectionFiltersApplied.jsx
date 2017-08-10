import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import FilterTag from './FilterTag';

import * as FiltersActions from '../../actions/filters';
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

  buildResultsExplanation() {
    if (this.props.filters.length > 0) {
      return this.buildFilterTags();
    } else if (this.props.search.length > 0) {
      return (
        <div>
          <p>Results for {this.props.search}</p>
        </div>
      );
    } else {
      return null;
    }
  }

  componentWillUpdate(nextProps) {
    if (nextProps.filters.length > 0) {
      this.props.clearSearch();
      this.props.findFilteredObjects(nextProps.filters);
    } else if (nextProps.search.length > 0) {
        this.props.clearAllFilters();
        this.props.searchObjects(nextProps.search);
    } else {
      this.props.clearSearch();
      this.props.clearAllFilters();
      this.props.getAllObjects();
    }
  }

  render() {
    return (
      <div>{this.buildResultsExplanation()}</div>
    );
  }
}

const mapStateToProps = state => {
  return {
    filters: state.filters,
    search: state.search
  }
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign({},
    FiltersActions,
    ObjectsActions,
    SearchActions
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionFiltersApplied);
