import React, { Component } from 'react';
import Masonry from 'react-masonry-component';

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
        {this.props.masonryElements.slice(0, 20)}
      </Masonry>
    );
  }
}

export default MasonryGrid;
