import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class SiteHeaderMenuItems extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <a href={this.props.link} alt={this.props.title}>{this.props.title}</a>
      </div>
    );
  }
}

export default SiteHeaderMenuItems;
