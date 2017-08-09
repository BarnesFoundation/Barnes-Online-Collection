import React, { Component } from 'react';

import SiteHeaderMenuItem from './SiteHeaderMenuItem';

class SiteHeaderMenuItems extends Component {
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
