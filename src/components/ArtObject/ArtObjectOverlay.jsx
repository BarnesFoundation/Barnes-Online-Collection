import React, { Component } from 'react';

import ArtObjectCaption from './ArtObjectCaption';

class ArtObjectOverlay extends Component {
  render() {
    return (
      <p><ArtObjectCaption title={this.props.title} medium={this.props.medium}/></p>
    );
  }
}

export default ArtObjectOverlay;
