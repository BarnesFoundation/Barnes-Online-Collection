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

  handleSliderFilter(value) {
    let filter = this.props.filter;
    filter.value = value;
    this.props.addFilter(filter);
  }

  getClasses() {
    const filter = this.props.filter;
    // todo: this is kind of a quick fix. Maybe this should be defined in a more structured way.
    const isRadioStyle = filter.filterGroup === 'linearity';

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

    if (isRadioStyle) {
      classes += ' filter-style-radio';
    }

    if (this.filterIsApplied() > -1) {
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
