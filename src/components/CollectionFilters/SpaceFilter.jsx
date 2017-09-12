import React, { Component } from 'react';

class SpaceFilter extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.preventDefault();
    this.props.handleClick();
  }

  render() {
    return <div><p>Space Filter</p></div>;
  }
}

export default SpaceFilter;
