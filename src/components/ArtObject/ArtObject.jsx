import React, { Component } from "react";
import "./artObject.css";

import ArtObjectImage from "./ArtObjectImage";
import ArtObjectOverlay from "./ArtObjectOverlay";

class ArtObject extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
    };

    this.revealArtObject = this.revealArtObject.bind(this);
  }

  revealArtObject() {
    this.setState({ loaded: true });
  }

  getClasses() {
    let classes = "art-object-fade__";
    if (this.state.loaded) {
      classes += "in";
    } else {
      classes += "out";
    }
    return classes;
  }

  render() {
    return (
      <div className={this.getClasses()}>
        <ArtObjectImage
          alt={this.props.title}
          src={this.props.imageUrlSmall}
          backupSrc={this.props.imageUrlLarge}
          sources={this.props.gridSources}
          width={this.props.imageWidth}
          height={this.props.imageHeight}
          revealArtObject={this.revealArtObject}
        />
        <ArtObjectOverlay {...this.props} />
      </div>
    );
  }
}

export default ArtObject;
