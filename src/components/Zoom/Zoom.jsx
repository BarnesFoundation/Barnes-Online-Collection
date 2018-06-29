import React, { Component } from 'react'
import leaflet from 'leaflet'
import jQuery from 'jquery'
import 'leaflet-iiif'
import 'leaflet/dist/leaflet.css'
import './zoom.css'

const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL

window.$ = window.jQuery = jQuery

class Zoom extends Component {
  componentDidMount() {
    const map = leaflet.map('map', {
      center: [0, 0],
      crs: leaflet.CRS.Simple,
      zoom: 2,
      minZoom: 2,
    })

    const info = `${IMAGE_BASE_URL}/tiles/${this.props.id}/info.json`
    const opts = {
      'quality': 'color',
      'tileFormat': 'jpg',
    }

    map.addLayer(leaflet.tileLayer.iiif(info, opts))
    map.scrollWheelZoom.disable()
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
