import React, { Component } from 'react';
import leaflet from 'leaflet';
import jQuery from 'jquery';
import 'leaflet-iiif';
import 'leaflet/dist/leaflet.css';
import './zoom.css';

const AWS_BUCKET = process.env.REACT_APP_AWS_BUCKET;

window.$ = window.jQuery = jQuery;

class Zoom extends Component {
  componentDidMount() {
    const map = leaflet.map('map', {
      center: [0, 0],
      crs: leaflet.CRS.Simple,
      zoom: 1,
      minZoom: 1
    });

    const info = `https://s3.amazonaws.com/${AWS_BUCKET}/tiles/${this.props.invno}/info.json`;
    console.log(info);

    const opts = {
      'quality': 'color',
      'tileFormat': 'jpg',
    };

    map.addLayer(leaflet.tileLayer.iiif(info, opts));
  }

  render() {
    return (
      <section className="zoom">
        <div className="map-container">
          <div id="map">
          </div>
        </div>
      </section>
    );
  }
}

export default Zoom;
