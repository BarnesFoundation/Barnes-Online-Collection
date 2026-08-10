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
    const { width, height } = this.props;
    // Set intrinsic width/height from the V2 image dims (imageWidth/imageHeight) when known. The grid
    // is now a CSS-grid masonry (CssMasonry) that computes each tile's row-span from its measured
    // height BEFORE the image bytes load — these attrs reserve the correct aspect box so that
    // measurement is right on the first frame → zero CLS. (Under the old react-masonry-component this
    // was reverted because the lib's absolute positioning fought the reserved boxes; CSS grid doesn't.)
    const dimProps = width && height ? { width, height } : {};

    // Offer the 320w thumbnail (_n) and the 1024w preview (_b) so the browser serves a resolution
    // matching the rendered column width × device-pixel-ratio — clears Lighthouse "serves images with
    // low resolution" on hi-dpi displays. Grid images are lazy + mostly below the fold, so this does
    // not over-fetch on initial load. `src` stays the fallback for no-srcset browsers.
    const { backupSrc } = this.props;
    const resProps =
      this.props.src && backupSrc
        ? {
            srcSet: `${this.props.src} 320w, ${backupSrc} 1024w`,
            sizes: "(min-width: 1024px) 340px, (min-width: 768px) 33vw, 50vw",
          }
        : {};

    return (
      <img
        ref={(ref) => {
          if (!this.ref) {
            this.ref = ref;
          }
        }}
        alt={this.props.alt}
        src={src}
        {...dimProps}
        {...resProps}
        loading="lazy"
        decoding="async"
        onLoad={this.revealImage}
        onError={this.revealImage}
      />
    );
  }
}

export default ArtObjectImage;
