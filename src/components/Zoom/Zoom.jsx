import React, { Component } from 'react';
import axios from 'axios';
import leaflet from 'leaflet';
import 'leaflet-iiif';
import 'leaflet.fullscreen';
import 'leaflet/dist/leaflet.css';
import 'leaflet.fullscreen/Control.FullScreen.css';
import './zoom.css';

const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL

class Zoom extends Component {
  constructor(props) {
    super(props);

    this.map = null;
    this.ref = null;
  }

  /**
   * Check to see if url is valid, preventing rendering blank image.
   * TODO => Replace this, this is only because IIIF viewer throws silently.
   * @param {string} url - url of info.json fike.
   */
  async checkURL(url) {
    const { catchFailureInViewer } = this.props;

    try {
      await axios.get(url);
    } catch (e) {
      if (catchFailureInViewer) {
        catchFailureInViewer();
      }
    }
  }

  /**
   * Capture change in ID from parent, if there is a change remount the leaflet component.
   */
  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.map.off();
      this.map.remove();

      this.mountLeaflet();
    }
  }

  mountLeaflet = () => {
    const { id } = this.props;

    if (this.ref) {
      this.map = leaflet.map(this.ref, {
        center: [0, 0],
        crs: leaflet.CRS.Simple,
        zoom: 1,
        fullscreenControl: true,
        fullscreenControlOptions: {
          position: 'topleft'
        },
      });

      const url = `${IMAGE_BASE_URL}/tiles/${id}/info.json`;

      const iiifLayer = leaflet.tileLayer.iiif(url, {
        quality: 'color',
        tileFormat: 'jpg',
        fitBounds: true,
        setMaxBounds: true,
      });


      // Add event handler to increase zoom if tile is not found.
      iiifLayer.on('tileerror', () => {
        const currentZoom = this.map.getZoom(); // Calculate current zoom.

        // If missing a layer, zoom in and set min zoom to next level, preventing zoom out.
        if (currentZoom !== this.map.getMaxZoom()) {
          this.map.setMinZoom(currentZoom + 1);
          this.map.setZoom(currentZoom + 1);
        }
      });

      // Set up scroll wheel when full screen.
      this.map.on('enterFullscreen', () => this.map.scrollWheelZoom.enable());
      this.map.on('exitFullscreen', () => this.map.scrollWheelZoom.disable());

      this.map.addLayer(iiifLayer);
      this.map.scrollWheelZoom.disable();

      this.checkURL(url);
    }
  }

  render() {
    return (
        <section className="zoom">
          <div className="map-container">
            <div ref={(ref) => {
              if (!this.ref) {
                this.ref = ref;
                this.mountLeaflet();
              }
            }}>
            </div>
          </div>
        </section>
    )
  }
}

export default Zoom
