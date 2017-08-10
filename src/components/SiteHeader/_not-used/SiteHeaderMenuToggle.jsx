import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class SiteHeaderMenuToggle extends Component {
  constructor(props) {
    super(props);
  }

  // TODO: on click, toggle visibility of site header menu items

  render() {
    return (
      <div>
        <p>SiteHeaderMenuToggle</p>
      </div>
    );
  }
}

export default SiteHeaderMenuToggle;
