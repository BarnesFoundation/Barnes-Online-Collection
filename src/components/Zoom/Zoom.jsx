import React, { Component } from 'react';
import axios from 'axios';
import OpenSeadragon from 'openseadragon';
import './zoom.css';

const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL

/**
 * Monkey patch OSD to replace default with color.
 */
const getTileUrl = OpenSeadragon.IIIFTileSource.prototype.getTileUrl;
OpenSeadragon.IIIFTileSource.prototype.getTileUrl = function (...args) {
  let res = getTileUrl.call(this, ...args);
  return res.replace('default', 'color');
}

class Zoom extends Component {
  constructor(props) {
    super(props);

    this.map = null;
    this.ref = null;
  }

  /**
   * Check to see if url is valid, preventing rendering blank image.
   * @param {string} url - url of info.json fike.
   */
  async fetchTileSource(url, scaleErrorLevel) {
    const { catchFailureInViewer } = this.props;

    try {
      const scaleFactors = [
        1,
        2,
        4,
        8,
        16
      ];

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
      res.tiles =  [
        {
          height: 256,
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

  /**
   * Capture change in ID from parent, if there is a change remount the OSD component.
   */
  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.osd.destroy();
      this.mountLeaflet();
    }
  }

  mountLeaflet = async (scaleErrorLevel = 0) => {
    const { id } = this.props;
    const res = await this.fetchTileSource(
      `${IMAGE_BASE_URL}/tiles/${id}/info.json`,
      scaleErrorLevel
    );

    if (this.ref) {
      this.osd = OpenSeadragon({
        element: this.ref,
        visibilityRatio: 1.0,
        constrainDuringPan: true,
        tileSources: [res],
        navigatorBackground: '#000',
        showNavigationControl: false,
        immediateRender: true,
        minZoomLevel: 0,
      });

      this.osd.addHandler('open', () => {
        const imageBounds = this.osd.world.getItemAt(0).getBounds();
        this.osd.viewport.fitBounds(imageBounds, true);
      });

      this.osd.addHandler('tile-load-failed', () => {
        this.osd.destroy();
        this.mountLeaflet(scaleErrorLevel + 1)
      });
    }
  }

  render() {
    return (
      <div className='osd-zoom'>
        <div
          className='osd-zoom__view'
          ref={ref => {
            if (!this.ref) {
              this.ref = ref;
              this.mountLeaflet();
            }
          }}
        >
        </div>
        <div className='osd-zoom__button-group'>
          <button className='osd-zoom__button osd-zoom__button--plus'>+</button>
          <button className='osd-zoom__button osd-zoom__button--minus'>-</button>
          <button className='osd-zoom__button osd-zoom__button--full-screen'>x</button>
        </div>
      </div>
    );
  }
}

export default Zoom
