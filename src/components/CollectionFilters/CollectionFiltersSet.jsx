import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import CollectionFiltersSetTypeCheckbox from './CollectionFiltersSetTypeCheckbox';
import CollectionFiltersSetTypeRadio from './CollectionFiltersSetTypeRadio';
import CollectionFiltersSetTypeSlider from './CollectionFiltersSetTypeSlider';

class CollectionFiltersSet extends Component {
  buildFilterSet(slug) {
    switch (slug) {
      case 'colors':
        return <CollectionFiltersSetTypeCheckbox/>;
      case 'lines':
        const filterSet = <div><CollectionFiltersSetTypeRadio/><CollectionFiltersSetTypeRadio/></div>;
        return filterSet;
      case 'light':
      case 'space':
        return <CollectionFiltersSetTypeSlider/>
      default:
        return null;
    }
  }
  render() {
    return (
      <div>
        {this.buildFilterSet(this.props.filters.visibleFilterSet)}
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

export default connect(mapStateToProps, mapDispatchToProps)(CollectionFiltersSet);
