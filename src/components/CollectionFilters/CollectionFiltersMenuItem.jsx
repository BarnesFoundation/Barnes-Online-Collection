import React, { Component } from 'react';

class CollectionFiltersMenuItem extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    this.props.selectFilter(this.props.title);
  }

  render() {
    return (
      <button
        onClick={this.handleClick}
        name={this.props.name}
      >
        {this.props.title}
      </button>
    );
  }
}

export default CollectionFiltersMenuItem;
