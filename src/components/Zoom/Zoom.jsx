import React, { Component } from 'react';
import axios from 'axios';
import leaflet from 'leaflet';
import 'leaflet-iiif';
import 'leaflet/dist/leaflet.css';
import './zoom.css';

const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL

class Zoom extends Component {
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

  async componentDidMount() {
    const map = leaflet.map('map', {
      center: [0, 0],
      crs: leaflet.CRS.Simple,
      zoom: 1,
      // maxZoom: 0.8,
      // minZoom: 0,
    });

    const info = `${IMAGE_BASE_URL}/tiles/${this.props.id}/info.json`;
    const opts = { quality: 'color', tileFormat: 'jpg', fitBounds: true, setMaxBounds: true };

    const iiifLayer = leaflet.tileLayer.iiif(info, opts);

    // Add event handler to increase zoom if tile is not found.
    iiifLayer.on('tileerror', () => {
      const currentZoom = map.getZoom(); // Calculate current zoom.

      // If missing a layer, zoom in and set min zoom to next level, preventing zoom out.
      if (currentZoom !== map.getMaxZoom()) {
        map.setMinZoom(currentZoom + 1);
        map.setZoom(currentZoom + 1);
      }
    });

    map.addLayer(iiifLayer);
    map.scrollWheelZoom.disable();

    this.checkURL(info);
  }

  render() {
    return (
      <section className="zoom">
        <div className="map-container">
          <div id="map">
          </div>
        </div>
      </section>
    )
  }
}

export default Zoom
