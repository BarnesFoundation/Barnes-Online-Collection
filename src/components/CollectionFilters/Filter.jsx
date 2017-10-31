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

  isFilterApplied() {
    return this.props.filters.ordered.filter((filter) => {
      return filter.slug === this.props.filter.slug;
    }).length > 0;
  }

  handleButtonFilter() {
    const filter = this.props.filter;

    if (this.isFilterApplied()) {
      this.props.removeFilter(filter);
    } else {
      this.props.addFilter(filter);
    }
  }

  handleSliderFilter(value) {
    let filter = this.props.filter;
    filter.value = value;
    this.props.addFilter(filter);
  }

  getClasses() {
    const filter = this.props.filter;
    // todo: this is kind of a quick fix. Maybe this should be defined in a more structured way.
    const isRadioStyle = filter.filterGroup === 'linearity';

    let classes = 'btn btn-filter ';
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

    if (isRadioStyle) {
      classes += ' filter-style-radio';
    }

    if (this.isFilterApplied()) {
      classes += ' is-applied';
    }

    return classes;
  }

  buildFilter() {
    switch (this.props.filter.filterType) {
      case 'color':
        return <ColorFilter
          handleClick={this.handleButtonFilter}
          style={{background: this.props.filter.color}}
          classes={this.getClasses()}
          />;
      case 'lineComposition':
      case 'lineLinearity':
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
          svgId={this.props.filter.svgId}
          slug={this.props.filter.slug}
          name={this.props.filter.name}
          value={this.props.filters.light ? this.props.filters.light.value : null}
        />;
      case 'space':
        return <SpaceFilter
          handleChange={this.handleSliderFilter}
          svgId={this.props.filter.svgId}
          slug={this.props.filter.slug}
          name={this.props.filter.name}
          value={this.props.filters.space ? this.props.filters.space.value : null}
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
