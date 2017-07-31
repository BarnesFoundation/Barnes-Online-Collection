import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import HeaderText from '../HeaderText/HeaderText';
import SiteHeaderMenu from './SiteHeaderMenu';

class SiteHeader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <p>SiteHeader</p>
        <div><img alt="BARNES LOGO"/></div>
        <SiteHeaderMenu />
      </div>
    );
  }
}

export default SiteHeader;
