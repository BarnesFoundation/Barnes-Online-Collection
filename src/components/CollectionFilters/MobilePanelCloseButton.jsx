import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Icon from '../Icon';

import * as MobileFiltersActions from '../../actions/mobileFilters';
import * as MobileSearchActions from '../../actions/mobileSearch';

class MobilePanelCloser extends Component {
  constructor (props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick (e) {
    this.props.closeMobileFilters();
    this.props.closeMobileSearch();
  }

  render () {
    return (
      <div className="btn btn-panel-close" onClick={this.handleClick}>
        <Icon svgId="cross_tag" classes="" />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign({},
    MobileFiltersActions,
    MobileSearchActions
  ), dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MobilePanelCloser);
