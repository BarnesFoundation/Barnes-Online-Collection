import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import SearchBar from './SearchBar';
import Results from './Results/Results';


class Layout extends Component {
  render() {
    return (
      <div className="app">
        <h1>Barnes Collection</h1>
        <SearchBar />
        <Results />        
      </div>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.element
};

export default Layout;