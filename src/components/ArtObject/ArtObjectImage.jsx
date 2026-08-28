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
    const { width, height, sources, backupSrc } = this.props;
    // Intrinsic width/height from the V2 image dims (imageWidth/imageHeight) when known → CssMasonry
    // computes each tile's row-span from a box that's correct BEFORE the image loads (zero CLS).
    const dimProps = width && height ? { width, height } : {};
    const sizes = "(min-width: 1024px) 340px, (min-width: 768px) 33vw, 50vw";

    // The <img> carries the JPG srcset (n/m/b) — the universal fallback. `sources` (from
    // objectDataUtils.gridSources) adds a full n/m/b set; without it, fall back to the old n/b pair.
    const jpgSrcset = sources
      ? sources.jpg
      : this.props.src && backupSrc
      ? `${this.props.src} 320w, ${backupSrc} 1024w`
      : null;

    const img = (
      <img
        ref={(ref) => {
          if (!this.ref) {
            this.ref = ref;
          }
        }}
        alt={this.props.alt}
        src={src}
        {...dimProps}
        {...(jpgSrcset ? { srcSet: jpgSrcset, sizes } : {})}
        loading="lazy"
        decoding="async"
        onLoad={this.revealImage}
        onError={this.revealImage}
      />
    );

    if (!sources) return img;

    // <picture>: WebP → JPG <img> fallback, each an n/m/b srcset (browser picks the right SIZE).
    // NOTE: AVIF is intentionally NOT offered for the grid. AVIF gives ~15% more byte savings than
    // WebP but its DECODE is ~2–3× heavier, and that cost multiplies across ~12 thumbnails on a
    // CPU-throttled phone — it regressed mobile TBT (~150ms → ~770ms) and Perf (88 → 73). WebP keeps
    // ~40% of the byte win vs JPG with near-JPEG decode speed. (The _m/_b AVIF derivatives still
    // exist in S3 — re-add a `<source type="image/avif">` here to use them, e.g. for large hero art
    // where one decode is cheap relative to the bytes saved.) loading/decoding/onLoad stay on <img>.
    return (
      <picture>
        <source type="image/webp" srcSet={sources.webp} sizes={sizes} />
        {img}
      </picture>
    );
  }
}

export default ArtObjectImage;
