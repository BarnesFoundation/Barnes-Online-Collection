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
      center: [2048, 2048],
      crs: leaflet.CRS.Simple,
      zoom: 2,
      minZoom: 2
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
          <img className="zoom__exit" src="/x.svg" alt="close zoom" onClick={this.props.onExit}/>
          <div id="map">
          </div>
        </div>
      </section>
    );
  }
}

export default Zoom;
