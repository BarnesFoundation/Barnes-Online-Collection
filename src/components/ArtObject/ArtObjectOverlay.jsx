import React, { Component } from 'react';

import ArtObjectCaption from './ArtObjectCaption';

class ArtObjectOverlay extends Component {
  render() {
    return (
      <div className="art-object-overlay">
        <ArtObjectCaption title={this.props.title} medium={this.props.medium}/>
      </div>
    );
  }
}

export default ArtObjectOverlay;
