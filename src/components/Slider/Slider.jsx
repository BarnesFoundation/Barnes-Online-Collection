import React, { Component } from 'react';
import './slider.css';

class Slider extends Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    rangeMin: 0,
    rangeMax: 100,
    defaultValue: 50,
  }

  render() {
    return (
      <div
        className="component-slider"
        data-label-style={this.props.labelStyle}
      >
        <span
          className="slider-label font-smallprint hidden show-for-style-inline"
        >{this.props.labelLeft}</span>
        <input
          className="slider"
          type="range"
          min={this.props.rangeMin}
          max={this.props.rangeMax}
          defaultValue={this.props.defaultValue}
        />
        <span className="slider-label font-smallprint hide-for-style-inline">{this.props.labelLeft}</span>
        <span className="slider-label font-smallprint">{this.props.labelRight}</span>
      </div>
    );
  }
}

export default Slider;