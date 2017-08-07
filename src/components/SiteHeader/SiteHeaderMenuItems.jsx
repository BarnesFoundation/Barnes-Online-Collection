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
        <SiteHeaderMenuItem title="What's On" link="whats-on"/>
        <SiteHeaderMenuItem title="Plan Your Visit" link="plan-your-visit"/>
        <SiteHeaderMenuItem title="Our Collection" link="/whats-on/collection"/>
        <SiteHeaderMenuItem title="Take a Class" link="classes"/>
      </div>
    );
  }
}

export default SiteHeaderMenuItems;
