import React, { Component } from 'react';
import axios from 'axios';
import OpenSeadragon from 'openseadragon';
import './zoom.css';

const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL;

/**
 * Monkey patch OSD to replace default with color.
 */
const getTileUrl = OpenSeadragon.IIIFTileSource.prototype.getTileUrl;
OpenSeadragon.IIIFTileSource.prototype.getTileUrl = function (...args) {
  const res = getTileUrl.call(this, ...args);
  return res.replace('default', 'color');
};

class Zoom extends Component {
  constructor (props) {
    super(props);

    this.ref = null; // Ref for OSD mount

    // Full screen status.
    this.isFullScreen = false;

    // OSD functions.
    this.zoomIn = null;
    this.zoomOut = null;
    this.fullScreen = null;
  }

  /**
   * Check to see if url is valid, preventing rendering blank image.
   * @param {string} url - url of info.json fike.
   * @param {number} scaleErrorLevel - level of scale error, if any.
   */
  async fetchTileSource (url, scaleErrorLevel) {
    const { catchFailureInViewer } = this.props;

    try {
      const scaleFactors = [1, 2, 4, 8];

      if (scaleErrorLevel > scaleFactors.length) {
        throw new Error('No more valid scale levels.');
      }

      const { data: res } = await axios.get(url);
      const { width, height } = res;

      // Modify json response to match
      const root = res['@id'].replace('http://localhost:8080/', '');
      res['@id'] = `${IMAGE_BASE_URL}/tiles/${root}`;
      res.sizes = [{ width, height }];
      res.profile[1].qualities = ['color'];
      res.tiles = [
        {
          height: 256,
          // If tiles errored out a scale factor of 16, we want to cut that down to 8,
          // and so on.
          scaleFactors: scaleErrorLevel
            ? scaleFactors.slice(0, scaleErrorLevel * -1)
            : scaleFactors,
          width: 256
        }
      ];

      return res;
    } catch (e) {
      console.log(e);
      if (catchFailureInViewer) {
        catchFailureInViewer();
      }
    }
  }

  componentWillUnmount () {
    if (this.osd) {
      this.osd.destroy();
    }
  }

  /**
   * Capture change in ID from parent, if there is a change remount the OSD component.
   */
  componentDidUpdate (prevProps) {
    if (prevProps.id !== this.props.id) {
      this.osd.destroy();
      this.setUpOSD();
    }
  }

  /**
   * Set up OSD component.
   * @param {number?} scaleErrorLevel - If an error has been thrown at a previous scale level.
   */
  setUpOSD = async (scaleErrorLevel = 0) => {
    const { id } = this.props;
    const res = await this.fetchTileSource(
      `${IMAGE_BASE_URL}/tiles/${id}/info.json`,
      scaleErrorLevel
    );

    if (this.ref) {
      this.osd = OpenSeadragon({
        element: this.ref,
        constrainDuringPan: true,
        tileSources: [res],
        navigatorBackground: '#fff',
        showNavigationControl: false,
        immediateRender: false,
        minZoomLevel: 0,
        maxZoomLevel: 8
      });

      this.osd.addHandler('open', () => {
        const imageBounds = this.osd.world.getItemAt(0).getBounds();
        this.osd.viewport.fitBounds(imageBounds, true);
      });

      this.osd.addHandler('tile-load-failed', () => {
        this.osd.destroy();
        this.setUpOSD(scaleErrorLevel + 1);
      });

      // Set up control functions.
      this.zoomIn = () => {
        const zoomTo = Math.max(
          this.osd.viewport.getZoom() + 0.5,
          this.osd.viewport.getZoom() * 2
        );

        this.osd.viewport.zoomTo(
          Math.min(
            zoomTo,
            this.osd.viewport.getMaxZoom()
          )
        );
      };

      this.zoomOut = () => {
        const zoomTo = Math.min(
          this.osd.viewport.getZoom() - 0.5,
          this.osd.viewport.getZoom() / 2
        );

        this.osd.viewport.zoomTo(
          Math.max(
            zoomTo,
            this.osd.viewport.getMinZoom()
          )
        );
      };

      this.fullScreen = () => {
        this.osd.setFullScreen(!this.isFullScreen);
        this.isFullScreen = !this.isFullScreen;
      };
    }
  };

  render () {
    return (
      <div className='osd-zoom'>
        <div
          className='osd-zoom__view'
          ref={ref => {
            if (!this.ref) {
              this.ref = ref;
              this.setUpOSD();
            }
          }}
        >
          {/** OSD controls. */}
          <div className='osd-zoom__button-group'>
            <button
              className='osd-zoom__button'
              onClick={() => {
                if (this.zoomIn) this.zoomIn();
              }}
            >
              <span className='osd-zoom__button-content'>+</span>
            </button>
            <button
              className='osd-zoom__button'
              onClick={() => {
                if (this.zoomOut) this.zoomOut();
              }}
            >
              <span className='osd-zoom__button-content osd-zoom__button-content--minus'>-</span>
            </button>
            <button
              className='osd-zoom__button'
              onClick={() => {
                this.fullScreen();
              }}
            >
              <span className='osd-zoom__button-content osd-zoom__button-content--full-screen'>
                <FullScreenIcon />
              </span>
            </button>
          </div>
        </div>

      </div>
    );
  }
}

/**
 * SVG icon for fullscreen.
 */
const FullScreenIcon = () => (
  <svg
    fill="currentColor"
    id="icon--full-screen"
    x="0px"
    y="0px"
    viewBox="0 0 512 512"
    style={{ enableBackground: 'new 0 0 512 512' }}
  >
    <g>
      <g>
        <polygon points="68.284,40 165,40 165,0 0,0 0,165 40,165 40,68.284 177,205.284 205.284,177 		" />
      </g>
    </g>
    <g>
      <g>
        <polygon points="205.284,335 177,306.716 40,443.716 40,347 0,347 0,512 165,512 165,472 68.284,472 		" />
      </g>
    </g>
    <g>
      <g>
        <polygon points="347,0 347,40 443.716,40 306.716,177 335,205.284 472,68.284 472,165 512,165 512,0 		" />
      </g>
    </g>
    <g>
      <g>
        <polygon points="472,347 472,443.716 335,306.716 306.716,335 443.716,472 347,472 347,512 512,512 512,347 		" />
      </g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
  </svg>
);

export default Zoom;
