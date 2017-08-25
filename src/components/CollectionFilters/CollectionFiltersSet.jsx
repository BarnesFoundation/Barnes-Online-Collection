import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ColorFilters from './ColorFilters';
import CollectionFiltersSetTypeCheckbox from './CollectionFiltersSetTypeCheckbox';
import CollectionFiltersSetTypeRadio from './CollectionFiltersSetTypeRadio';
import CollectionFiltersSetTypeSlider from './CollectionFiltersSetTypeSlider';

class CollectionFiltersSet extends Component {
  filterSet() {
    const slug = this.props.filterSets.visibleFilterSet;

    switch (slug) {
      case 'colors':
        return <ColorFilters filter={slug}/>;
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

  getClasses() {
    let classes = 'collection-filters-set';
    if (this.props.filterSets.visibleFilterSet.length) {
      classes += ' is-open';
    }
    return classes;
  }

  render() {
    return (
      <div className={this.getClasses()}>
        {this.filterSet()}
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
