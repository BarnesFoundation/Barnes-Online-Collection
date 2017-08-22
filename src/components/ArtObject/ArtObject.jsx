import React, { Component } from 'react';
import './artObject.css';

import ArtObjectImage from './ArtObjectImage';
import ArtObjectOverlay from './ArtObjectOverlay';

class ArtObject extends Component {
  render() {
    return (
      <div>
        <ArtObjectImage alt={this.props.title} src={this.props.imageUrlSmall}/>
        <ArtObjectOverlay {...this.props}/>
      </div>
    );
  }
}

export default ArtObject;
