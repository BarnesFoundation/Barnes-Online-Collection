import React, { Component } from 'react';
import * as Masonry from 'react-masonry-component';

const masonryOptions = {
  transitionDuration: 0,
};

class MasonryGrid extends Component {
  render() {
    return (
      <Masonry
        className={'component-masonry-grid'}
        elementType={'ul'}
        options={masonryOptions}
        disableImagesLoaded={false}
        updateOnEachImageLoad={false}
      >
        {this.props.masonryElements}
      </Masonry>
    );
  }
}

export default MasonryGrid;
