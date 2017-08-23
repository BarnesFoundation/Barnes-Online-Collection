import React, { Component } from 'react';
const Masonry = require('react-masonry-component');

const masonryOptions = {
  transitionDuration: 0,
};

class MasonryGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.setState({isLoaded: false});
  }

  handleLayoutComplete(items) {
    var _this = this;

    // if it's already loaded, just return
    if (this.state.isLoaded) {
      return;
    }

    // add a slight delay, otherwise, it still FOUCes a little.
    setTimeout(function() {
      _this.setState({isLoaded: true});
    }, 150);
  }

  render() {
    return (
      <Masonry
        className={'component-masonry-grid'}
        data-hidden={!this.state.isLoaded}
        elementType={'ul'}
        options={masonryOptions}
        disableImagesLoaded={false}
        updateOnEachImageLoad={false}
        onLayoutComplete={this.handleLayoutComplete.bind(this)}
      >
        {this.props.masonryElements}
      </Masonry>
    );
  }
}

export default MasonryGrid;