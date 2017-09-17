import React, { Component } from 'react';

import Slider from '../Slider/Slider';

class LightFilter extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    this.props.handleChange(value);
  }

  render() {
    return (
      <Slider
        labelStyle="inline"
        labelLeft="Diffused"
        labelRight="Light"
        handleChange={this.handleChange}
      />
    );
  }
}

export default LightFilter;
