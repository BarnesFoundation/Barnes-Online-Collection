import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import Test from './Test';

class Layout extends Component {
  render() {
    return (
      <div className="app">
        <h1>Welcome to my Application</h1>
        <Route path="/test" component={Test} />
      </div>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.element
};

export default Layout;