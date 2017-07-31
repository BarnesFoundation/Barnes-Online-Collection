import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import SiteHeaderMenuItem from './SiteHeaderMenuItem';

class SiteHeaderMenuItems extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <SiteHeaderMenuItem title="What's On" link="#"/>
        <SiteHeaderMenuItem title="Plan Your Visit" link="#"/>
        <SiteHeaderMenuItem title="Our Collection" link="#"/>
        <SiteHeaderMenuItem title="Take a Class" link="#"/>
      </div>
    );
  }
}

export default SiteHeaderMenuItems;
