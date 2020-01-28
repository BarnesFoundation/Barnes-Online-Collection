import React, { Component } from 'react';
import Masonry from 'react-masonry-component';

const masonryOptions = {
  transitionDuration: 0,
};

const MasonryGrid = ({ masonryElements }) => (
  <Masonry
    className={'component-masonry-grid'}
    elementType={'ul'}
    options={masonryOptions}
    disableImagesLoaded={false}
    updateOnEachImageLoad={false}
  >
    {masonryElements}
  </Masonry>
);

export default MasonryGrid;
