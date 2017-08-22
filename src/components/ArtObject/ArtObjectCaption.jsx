import React, { Component } from 'react';

class ArtObjectCaption extends Component {
  render() {
    return (
      <div className="art-object-caption">
        <p>{this.props.title}, {this.props.medium}</p>
      </div>
    );
  }
}

export default ArtObjectCaption;
