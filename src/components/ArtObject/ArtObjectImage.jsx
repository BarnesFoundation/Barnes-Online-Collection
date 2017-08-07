import React, { Component } from 'react';

class ArtObjectImage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <img alt={this.props.alt} src={this.props.src}/>
    );
  }
}

export default ArtObjectImage;
