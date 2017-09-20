import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import FilterTag from './FilterTag';

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

  getClasses() {
    let classes = 'applied-filter-tags-container';
    if (!this.props.visible) {
      classes += ' hidden'
    }
    return classes;
  }

  render() {
    const filters = this.props.filters.ordered;

    if (!filters) {
      return null;
    }

    const hasFilters = filters.length > 0;

    return (
      <div>
        { hasFilters &&
          <div className={this.getClasses()}>
            {this.getFilterTags(filters)}
          </div>
        }
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
