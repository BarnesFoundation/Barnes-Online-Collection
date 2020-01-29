import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ColorFilters from './ColorFilters';
import LineFilters from './LineFilters';
import LightFilters from './LightFilters';
import SpaceFilters from './SpaceFilters';

class CollectionFiltersSet extends Component {
  filterSet() {
    const slug = this.props.filterSets.visibleFilterSet;

    switch (slug) {
      case 'colors':
        return <ColorFilters filter={slug}/>;
      case 'lines':
        return <LineFilters filter={slug}/>;
      case 'light':
        return <LightFilters filter={slug}/>;
      case 'space':
        return <SpaceFilters filter={slug}/>;
      default:
        return null;
    }
  }

  getClasses() {
    let classes = 'collection-filters-set';
    if (this.props.filterSets.visibleFilterSet) {
      classes += ' collection-filters-set--is-open';
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
