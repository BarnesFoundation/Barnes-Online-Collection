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
        <ArtObjectImage alt={this.props.title} src={this.props.imageUrlSmall}/>
        <ArtObjectOverlay title={this.props.title} medium={this.props.medium}/>
      </div>
    );
  }
}

export default ArtObject;
