import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as MobileFiltersActions from '../../actions/mobileFilters';

class MobileCollectionFiltersToggle extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.toggleMobileFilters();
  }

  render() {
    const filterSets = this.props.filterSets.sets;
    return (
      <button onClick={this.handleClick} className="btn">Toggle Mobile Filters</button>
    );
  }
}

const mapStateToProps = state => {
  return {
    filterSets: state.filterSets,
    mobileFilters: state.mobileFilters,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign({}, MobileFiltersActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MobileCollectionFiltersToggle);
