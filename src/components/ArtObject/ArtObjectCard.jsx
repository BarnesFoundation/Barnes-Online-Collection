import React, { Component } from "react";

class ArtObjectCard extends Component {
  render() {
    return (
      <div>
        <img src={this.props.imageUrlSmall} alt={this.props.title} />
        <h2>{this.props.title}</h2>
        <h3>{this.props.people}</h3>
        <p>{this.props.medium}</p>
      </div>
    );
  }
}

export default ArtObjectCard;
