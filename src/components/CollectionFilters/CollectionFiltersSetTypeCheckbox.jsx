import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import CollectionFiltersCheckbox  from './CollectionFiltersCheckbox';

class CollectionFiltersSetTypeCheckbox extends Component {
  buildCheckboxes() {
    return this.props.filterSets.sets[this.props.filter].options.map((option, index) => {
      return (
        <CollectionFiltersCheckbox
          key={index} index={index}
          slug={option.slug}
          displayType={option.displayType}
          displayValue={option.displayValue}
          method={option.method}
          type={option.type}
          field={option.field}
          term={option.term}
        />
      );
    });
  }

  render() {
    return (
      <div>
        {this.buildCheckboxes()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    filterSets: state.filterSets
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign({}), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionFiltersSetTypeCheckbox);
