import React, { Component } from "react";

import ArtObjectCaption from "./ArtObjectCaption";

class ArtObjectOverlay extends Component {
  render() {
    return (
      <div className="art-object-overlay">
        <ArtObjectCaption {...this.props} />
      </div>
    );
  }
}

export default ArtObjectOverlay;
