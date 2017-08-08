import React, { Component } from 'react';

import SiteHeaderMenu from './SiteHeaderMenu';

class SiteHeader extends Component {
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
