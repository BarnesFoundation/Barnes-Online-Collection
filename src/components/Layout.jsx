import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SearchBar from './SearchBar/SearchBar';
import SearchResults from './SearchResults/SearchResults';
import SearchTags from './SearchTags/SearchTags';


class Layout extends Component {
  render() {
    console.log(this.props.history);
    return (
      <div className="app">
        <h1>Barnes Collection</h1>
        <SearchBar />
        <SearchTags />
        <SearchResults history={this.props.history}/>
      </div>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.element
};

export default Layout;