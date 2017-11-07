import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Icon from '../Icon';

import * as MobileFiltersActions from '../../actions/mobileFilters';

class MobileFiltersOpener extends Component {
  constructor(props) {
    super(props);

    this.handleClickFilterBtn = this.handleClickFilterBtn.bind(this);
    this.handleClickSearchBtn = this.handleClickSearchBtn.bind(this);
  }

  handleClickFilterBtn() {
    this.props.openMobileFilters();
  }

  handleClickSearchBtn() {
    // debugger;
    // this.props.openMobileSearch();
  }

  render() {
    const filterCount = this.props.filters.length;

    return (
      <div className="mobile-buttons-set">
        <button onClick={this.handleClickFilterBtn} className="btn-mobile btn-open-mobile-filters font-zeta color-light">
          <Icon svgId='filters' classes='icon collection-filter-icon' />
          <span className="label">
            Filter{ filterCount > 0 && ` (${filterCount})` }
          </span>
        </button>
        <button onClick={this.handleClickFilterBtn} className="btn-mobile btn-open-mobile-search font-zeta color-light">
          <Icon svgId='search' classes='icon collection-search-icon' />
        </button>
      </div>
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
  return bindActionCreators(Object.assign(
    {},
    MobileFiltersActions,
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MobileFiltersOpener);
