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
      zoom: 2,
      minZoom: 2,
      fitBounds: true,
    });

    const info = `${IMAGE_BASE_URL}/tiles/${this.props.id}/info.json`;
    const opts = { quality: 'color', tileFormat: 'jpg' };

    const iiifLayer = leaflet.tileLayer.iiif(info, opts);

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
