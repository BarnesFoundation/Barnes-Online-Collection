import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as QueryActions from '../../actions/query';
import * as SearchTagActions from '../../actions/searchTags';

class SearchTag extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    this.props.appendToQuery(event.target.textContent);
    this.props.removeSearchTag(event.target.textContent);
  }

  render() {
    return (
      <button onClick={this.handleClick} className="search-tag">
          {this.props.tag}
      </button>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, QueryActions, SearchTagActions), dispatch);
}

export default connect(null, mapDispatchToProps)(SearchTag);
