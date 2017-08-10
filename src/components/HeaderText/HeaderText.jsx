import React, { Component } from 'react';

class HeaderText extends Component {
  render() {
    return (
      <h1>{this.props.text}</h1>
    );
  }
}

export default HeaderText;
