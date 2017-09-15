import React, { Component } from 'react';
import './slider.css';

import Slider, { createSliderWithTooltip } from 'rc-slider';
import 'rc-slider/assets/index.css';

const SliderWithTooltip = createSliderWithTooltip(Slider);

const percentFormatter = (v) => {
  return `${v}%`;
};

class CustomSlider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.defaultValue || 50,
    };
  }

  onSliderChange(value) {
    // This will set state.value to the active value between 0-100.
    this.setState({
      value: value
    });

    this.props.handleChange(value);
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
        <SliderWithTooltip
          tipFormatter={percentFormatter}
          className="slider"
          defaultValue={this.state.value}
          onChange={this.onSliderChange.bind(this)}
        />
        <span className="slider-label slider-label-left font-smallprint hide-for-style-inline">{this.props.labelLeft}</span>
        <span className="slider-label slider-label-right font-smallprint">{this.props.labelRight}</span>
      </div>
    );
  }
}

export default CustomSlider;
