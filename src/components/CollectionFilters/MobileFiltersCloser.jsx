import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as MobileFiltersActions from '../../actions/mobileFilters';

class MobileFiltersCloser extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.closeMobileFilters();
  }

  render() {
    return (
      <div onClick={this.handleClick} className="mobile-filters-overlay"></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(MobileFiltersCloser);
