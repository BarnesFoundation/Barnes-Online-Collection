import React, { Component } from 'react';

class LightFilter extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.preventDefault();
    this.props.handleClick();
  }

  render() {
    return <div><p>Light Filter</p></div>;
  }
}

export default LightFilter;
