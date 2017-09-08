import React, { Component } from 'react';
import './slider.css';

import SliderEl from 'rc-slider/lib/Slider';
import 'rc-slider/assets/index.css';

const trackHeight = 5;
const handleSize = 30;
const trackColor = '#b4b4b4';
const handleBorderColor = '#6e6e6e';
const trackStyle = {
  backgroundColor: trackColor,
  height: trackHeight,
};

class Slider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.defaultValue || 50,
    };
  }

  render() {
    return (
      <div
        className="component-slider"
        data-label-style={this.props.labelStyle}
      >
       <span
        className="slider-label slider-label-left font-smallprint hidden show-for-style-inline"
      >{this.props.labelLeft}</span>
        <SliderEl
          className="slider"
          defaultValue={this.state.value}
          trackStyle={trackStyle}
          railStyle={trackStyle}
          handleStyle={{
            borderColor: handleBorderColor,
            height: handleSize,
            width: handleSize,
            marginLeft: -handleSize/2,
            marginTop: -handleSize/2 + trackHeight/2,
          }}
        />
        <span className="slider-label slider-label-left font-smallprint hide-for-style-inline">{this.props.labelLeft}</span>
        <span className="slider-label slider-label-right font-smallprint">{this.props.labelRight}</span>
      </div>
    );
  }
}

export default Slider;