import React, { Component } from "react";

import Icon from "../Icon";

class LineFilter extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.preventDefault();
    this.props.handleClick();
  }

  render() {
    return (
      <button onClick={this.handleClick} className={this.props.classes}>
        <Icon svgId={this.props.svgId} classes="collection-filter-icon" />
        {this.props.name}
      </button>
    );
  }
}

export default LineFilter;
