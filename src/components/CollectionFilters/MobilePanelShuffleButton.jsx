import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Icon from '../Icon';

import * as FiltersActions from '../../actions/filters';
import * as MobileFiltersActions from '../../actions/mobileFilters';
import * as MobileSearchActions from '../../actions/mobileSearch';

class MobilePanelCloser extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.props.shuffleFilters();
    this.props.closeMobileFilters();
    this.props.closeMobileSearch();
  }

  render() {
    return (
      <div className="btn btn-no-style btn-filter-shuffle" onClick={this.handleClick}>
        <Icon svgId="shuffle" classes="" />
        <span>Randomize</span>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign({},
    FiltersActions,
    MobileFiltersActions,
    MobileSearchActions,
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MobilePanelCloser);
