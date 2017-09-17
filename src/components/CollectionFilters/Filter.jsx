import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ColorFilter from './ColorFilter';
import LineFilter from './LineFilter';
import LightFilter from './LightFilter';
import SpaceFilter from './SpaceFilter';

import * as FiltersActions from '../../actions/filters';
import * as FilterSetsActions from '../../actions/filterSets';

class Filter extends Component {
  constructor(props) {
    super(props);
    this.handleButtonFilter = this.handleButtonFilter.bind(this);
    this.handleSliderFilter = this.handleSliderFilter.bind(this);
  }

  filterIsApplied() {
    const filters = this.props.filters.ordered;
    for (let i = 0; i < filters.length; i++) {
      if (filters[i].slug === this.props.filter.slug) {
        return i;
      }
    }
    return -1;
  }

  handleButtonFilter() {
    const filter = this.props.filter;

    if (this.props.filters.ordered.length === 0 || this.filterIsApplied() === -1) {
      this.props.addFilter(filter);
    } else {
      this.props.removeFilter(filter);
    }
  }

  handleSliderFilter(filter) {

  }

  getClasses() {
    const filter = this.props.filter;
    let classes = 'btn ';
    classes += filter.filterType + '-filter';

    switch(filter.filterType) {
      case 'color':
        classes += ' color-filter__' + filter.name;
        break;
      case 'line':
        classes += ' font-smallprint';
        break;
      default:
        break;
    }

    if (this.filterIsApplied() > -1) {
      classes += ' is-applied';
    }

    return classes;
  }

  buildFilter() {
    switch (this.props.filter.filterType) {
      case 'color':
        const style = {
          background: this.props.filter.color
        };

        return <ColorFilter
          handleClick={this.handleButtonFilter}
          style={style}
          classes={this.getClasses()}
          />;
      case 'line':
        return <LineFilter
          handleClick={this.handleButtonFilter}
          classes={this.getClasses()}
          slug={this.props.filter.slug}
          name={this.props.filter.name}
          svgId={this.props.filter.svgId}
        />;
      case 'light':
        return <LightFilter
          handleChange={this.handleSliderFilter}
          svgId='tool_lights'
        />;
      case 'space':
        return <SpaceFilter
          handleChange={this.handleSliderFilter}
          svgId='tool_space'
        />;
      default:
        return null;
    }
  }

  render() {
    return (this.buildFilter());
  }
}

const mapStateToProps = state => {
  return {
    filters: state.filters,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign({},
    FiltersActions,
    FilterSetsActions,
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
