import React, { Component } from 'react';

class ColorFilter extends Component {
  constructor (props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick (event) {
    event.preventDefault();
    this.props.handleClick();
  }

  render () {
    return (
      <button
        onClick={this.handleClick}
        style={this.props.style}
        className={this.props.classes}
      ></button>
    );
  }
}

export default ColorFilter;
