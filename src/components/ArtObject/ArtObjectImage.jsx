import React, { Component } from "react";

class ArtObjectImage extends Component {
  constructor(props) {
    super(props);

    this.revealImage = this.revealImage.bind(this);

    this.ref = null;

    // State to keep track of image src and if image has already loaded.
    this.state = {
      src: this.props.src,
      didLoad: false,
    };
  }

  revealImage() {
    const { backupSrc } = this.props;
    const { didLoad } = this.state;

    // If our ref is set, our image is smaller width than its container and this is our first image load,
    // replace the original smallImageURL with a largeImageURL.
    if (
      this.ref &&
      this.ref.getBoundingClientRect().width > this.ref.naturalWidth * 1.75 &&
      backupSrc &&
      !didLoad
    ) {
      this.setState({
        src: backupSrc,
        didLoad: true,
      });
    } else {
      this.props.revealArtObject();
    }
  }

  render() {
    const { src } = this.state;

    // NOTE: intrinsic width/height are intentionally NOT set here. V2 carries per-object
    // image_width/image_height (imageWidth/imageHeight), but this grid is react-masonry-component,
    // which absolutely-repositions items after measuring — reserving aspect boxes on the <img>
    // fights that JS layout and measurably WORSENS CLS (0.10 → 0.19, deterministic A/B). It also
    // silences the minor `unsized-images` diagnostic, but CLS (a Core Web Vital) wins. The right
    // fix is a CSS columns/grid layout that honors aspect-ratio; then flip these attrs back on.
    return (
      <img
        ref={(ref) => {
          if (!this.ref) {
            this.ref = ref;
          }
        }}
        alt={this.props.alt}
        src={src}
        loading="lazy"
        decoding="async"
        onLoad={this.revealImage}
        onError={this.revealImage}
      />
    );
  }
}

export default ArtObjectImage;
