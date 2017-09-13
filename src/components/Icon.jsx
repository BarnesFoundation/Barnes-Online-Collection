import React, { Component } from 'react';

class Icon extends Component {

  render() {
    return (
      <svg className={`icon icon-${this.props.svgId} ${this.props.classes}`}>
        <use xlinkHref={`#icon-${this.props.svgId}`}></use>
      </svg>
    );
  }
}

export default Icon;
