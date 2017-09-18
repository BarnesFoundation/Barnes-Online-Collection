import React, { Component } from 'react';

class ArtObjectImage extends Component {
  constructor(props) {
    super(props);

    this.revealImage = this.revealImage.bind(this);
  }

  revealImage() {
    this.props.revealArtObject();
  }

  render() {
    return (
      <img alt={this.props.alt} src={this.props.src} onLoad={this.revealImage}/>
    );
  }
}

export default ArtObjectImage;
