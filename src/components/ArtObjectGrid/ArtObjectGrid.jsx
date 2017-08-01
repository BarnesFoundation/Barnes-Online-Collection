import React, { Component } from 'react';

import ArtObject from '../ArtObject/ArtObject';
import ViewMoreButton from './ViewMoreButton';

class ArtObjectGrid extends Component {
  constructor(props) {
    super(props);

    // ArtObjectGrid needs to:
    // - know which objects to display
    // - render objects
  }

  render() {
    return (
      <div>
        <p>ArtObjectGrid</p>
        <ArtObject />
        <ViewMoreButton />
      </div>
    );
  }
}

export default ArtObjectGrid;
