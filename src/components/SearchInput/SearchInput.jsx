import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as QueryActions from '../../actions/query';
import * as ObjectsActions from '../../actions/objects';

import './searchInput.css';

class SearchInput extends Component {
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

  componentWillUpdate(nextProps) {
    // if (this.props.query !== nextProps.query) {
    //   // this.props.findObjectsByKeyword(nextProps.query);
    // }
  }

  render() {
    return (
      <div>
        <p>SearchInput</p>
      <section aria-label="search" className="searchbar">
        <form className="searchbar__container" onSubmit={this.handleSubmit}>
          <input
            type="text"
            value={this.props.query}
            onChange={this.handleChange}
            className="searchbar__input"
          />
        </form>
      </section>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    query: state.query
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({},ObjectsActions, QueryActions),
    dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchInput);
