import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import CollectionFiltersCheckbox  from './CollectionFiltersCheckbox';

class CollectionFiltersSetTypeCheckbox extends Component {
  buildCheckboxes(filterOptions) {
    return filterOptions.map((option, index) => {
      return <CollectionFiltersCheckbox key={index} value={option.slug} query={option.query}/>
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
  return bindActionCreators(Object.assign({}), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionFiltersSetTypeCheckbox);
