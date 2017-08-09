import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as QueriesActions from '../../actions/queries';
import * as FiltersActions from '../../actions/filters';

class CollectionFiltersSetTypeCheckbox extends Component {
  buildCheckboxes(filterOptions) {
    return Object.values(filterOptions).map((option, index) => {
      <button key={index} value={option.slug}>{option.slug}</button>
    });
  }

  render() {
    return (
      <div>
        <p>{this.props.filter}</p>
        {this.buildCheckboxes(this.props.filters.filterOptions[this.props.filter].options)}
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
    QueriesActions,
    FiltersActions
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionFiltersSetTypeCheckbox);
