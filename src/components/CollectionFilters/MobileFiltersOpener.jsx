import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Icon from '../Icon';

import * as MobileFiltersActions from '../../actions/mobileFilters';

class MobileFiltersOpener extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.openMobileFilters();
  }

  render() {
    const filterSets = this.props.filterSets.sets;
    const filterCount = this.props.filters.length;

    return (
      <button onClick={this.handleClick} className="btn-open-mobile-filters font-zeta color-light">
        <Icon svgId='filters' classes='collection-filter-icon' />
        Filter{ filterCount > 0 && ` (${this.props.filters.length})` }
      </button>
    );
  }
}

const mapStateToProps = state => {
  return {
    filterSets: state.filterSets,
    filters: state.filters,
    mobileFilters: state.mobileFilters,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign({}, MobileFiltersActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MobileFiltersOpener);
