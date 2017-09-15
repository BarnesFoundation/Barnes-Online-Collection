import React, { Component } from 'react';

import Slider from '../Slider/Slider';

class LightFilter extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    debugger;
    const filter = {
      value: value,
      name: 'light'
    };
    this.props.handleChange(filter);
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
