import React, { Component } from 'react';

import SiteHeader from '../../components/SiteHeader/SiteHeader';
import HeaderText from '../../components/HeaderText/HeaderText';

class Header extends Component {
  render() {
    return (
      <div>
        <SiteHeader />
        <HeaderText text="Albert Barnes taught people to look at works of art primarily in terms of their visual relationships."/>
      </div>
    );
  }
}

export default Header;
