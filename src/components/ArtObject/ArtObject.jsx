import React, { Component } from 'react';
import './artObject.css';

import ArtObjectImage from './ArtObjectImage';
import ArtObjectOverlay from './ArtObjectOverlay';
import ArtObjectCaption from './ArtObjectCaption';

class ArtObject extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <p>ArtObject</p>
        <ArtObjectImage />
        <ArtObjectOverlay />
        <ArtObjectCaption />
      </div>
    );
  }
}

export default ArtObject;
