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
        return <CollectionFiltersSetTypeCheckbox filter={slug}/>;
      case 'lines':
        return (
          <div>
            <CollectionFiltersSetTypeRadio filter={slug}/>
            <CollectionFiltersSetTypeRadio filter={slug}/>
          </div>
        );
      case 'light':
      case 'space':
        return <CollectionFiltersSetTypeSlider filter={slug}/>;
      default:
        return null;
    }
  }

  render() {
    return (
      <div>
        {this.buildFilterSet(this.props.filterSets.visibleFilterSet)}
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

export default connect(mapStateToProps, mapDispatchToProps)(CollectionFiltersSet);
