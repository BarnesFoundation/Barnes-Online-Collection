import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as QueryActions from '../actions/query';
import * as ObjectActions from '../actions/objects';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.setQuery(event.target.value);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.findObjectsByKeyword(this.props.query);
  }

  render() {
    return (
      <section aria-label="search">
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            value={this.props.query}
            onChange={this.handleChange}
          />
        </form>
      </section>
    );
  }
}

function mapStateToProps(state) {
  return {
    query: state.query
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({},ObjectActions, QueryActions),
    dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
