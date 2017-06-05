import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SearchBar from './SearchBar/SearchBar';
import Results from './Results/Results';
import SearchTags from './SearchTags/SearchTags';


class Layout extends Component {
  render() {
    return (
      <div className="app">
        <h1>Barnes Collection</h1>
        <SearchBar />
        <SearchTags />
        <Results />        
      </div>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.element
};

export default Layout;