import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as MobileFiltersActions from '../../actions/mobileFilters';
import * as MobileSearchActions from '../../actions/mobileSearch';

class MobilePanelCloser extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.closeMobileFilters();
    this.props.closeMobileSearch();
  }

  render() {
    return (
      <div onClick={this.handleClick} className="mobile-panel-overlay"></div>
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
  return bindActionCreators(Object.assign({},
    MobileFiltersActions,
    MobileSearchActions,
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MobilePanelCloser);
