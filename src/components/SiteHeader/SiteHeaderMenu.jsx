import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import SiteHeaderMenuItems from './SiteHeaderMenuItems';
import SiteHeaderMenuToggle from './SiteHeaderMenuToggle';
import SiteSearchToggle from './SiteSearchToggle';
import SiteSearchInput from './SiteSearchInput';

class SiteHeaderMenu extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <p>Site Header Menu</p>
        <SiteHeaderMenuItems />
        <SiteSearchToggle />
        <SiteSearchInput />
        <SiteHeaderMenuToggle />
      </div>
    );
  }
}

export default SiteHeaderMenu;

// NOTES:
// This will need to replicate the behavior of the site header menu on the museum site.
// -- Will need to hook into whatever site-wide search has been implemented for main site
