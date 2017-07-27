import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SearchBar from '../../components/SearchBar/SearchBar';
import SearchResults from '../../components/SearchResults/SearchResults';
import SearchTags from '../../components/SearchTags/SearchTags';


class LandingPage extends Component {
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

LandingPage.propTypes = {
  children: PropTypes.element
};

export default LandingPage;
