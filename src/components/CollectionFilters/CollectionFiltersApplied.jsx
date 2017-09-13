import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import FilterTag from './FilterTag';

import * as FiltersActions from '../../actions/filters';

class CollectionFiltersApplied extends Component {
  filterTags() {
    const filters = this.props.filters.ordered;
    if (!filters) {
      return null;
    } else {
      return filters.map((filter, index) =>
        <FilterTag
          key={index}
          index={index}
          filter={filter}
        />
      );
    }
  }

  getClasses() {
    let classes = 'applied-filter-tags-container';
    if (!this.props.visible) {
      classes += 'hidden'
    }
    return classes;
  }

  render() {
    return (
      <div className={this.getClasses()}>
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
