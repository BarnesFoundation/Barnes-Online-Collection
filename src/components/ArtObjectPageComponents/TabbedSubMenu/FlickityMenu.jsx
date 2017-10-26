import React, { Component } from 'react'

// note: #flickityWorkaround link directly to the js, because otherwise flickity requires you to change the webpack config,
// and react-scripts doesn't let you do that without "ejecting".
const Flickity = require('../../../../node_modules/flickity/dist/flickity.pkgd.js')

class FlickityMenu extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const selectedIndex = this.props.selectedIndex;
    const options = {
      // align the first one to the left, otherwise, center it.
      cellAlign: selectedIndex === 0 ? 'left' : 'center',
      initialIndex: selectedIndex,
      accessibility: true,
      pageDots: false,
      prevNextButtons: false,
      wrapAround: false,
    }

    // note: #flickityWorkaround - because we can't use react-flickity without changing webpack configs
    this.flickityInstance = new Flickity(this.componentEl, options)
  }

  componentWillUnMount() {
    // note: #flickityWorkaround - because we can't use react-flickity without changing webpack configs
    if (this.flickityInstance) {
      this.flickityInstance.destroy()
    }

    this.flickityInstance = null
  }

  render() {
    return (
      <div
        className="m-tabs__list tabs-list-mobile tabs-flickity"
        ref = {el => this.componentEl = el}
      >
        {this.props.tabsList}
      </div>
    )
  }
}

export default FlickityMenu
