import React, { Component } from 'react';

import ArtObjectCaption from './ArtObjectCaption';

class ArtObjectOverlay extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <p><ArtObjectCaption title={this.props.title} medium={this.props.medium}/></p>
    );
  }
}

export default ArtObjectOverlay;
