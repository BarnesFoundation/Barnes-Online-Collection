import React, { Component } from 'react';

class ArtObjectCaption extends Component {
  render() {
    return (
      <p>{this.props.title}, {this.props.medium}</p>
    );
  }
}

export default ArtObjectCaption;
