import React, { Component } from 'react';
import SearchTag from './SearchTag';
import { connect } from 'react-redux';

import './searchTags.css';

class SearchTags extends Component {
  render() {
    return (
      <section className="search-tags">
        {this.props.searchTags.map((searchTag) => {
          return (
            <SearchTag tag={searchTag} />
            );
        })}
      </section>
    );
  }
}

function mapStateToProps(state) {
  return {
    searchTags: state.searchTags
  }
}

export default connect(mapStateToProps)(SearchTags);
