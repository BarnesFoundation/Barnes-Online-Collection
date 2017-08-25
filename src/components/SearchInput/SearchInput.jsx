import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as SearchActions from '../../actions/search';

import './searchInput.css';

class SearchInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();

    this.props.addSearchTerm(this.state.value);
    this.setState({value: ''});
  }

  render() {
    return (
      <div aria-label="search" className="search-input">
        <form onSubmit={this.handleSubmit}>
          <div className="form-field">
            <input
              className="input"
              type="text"
              autoFocus="true"
              value={this.state.value}
              placeholder="Search an artist, word, period..."
              onChange={this.handleChange}
            />
            <input
              className="btn btn-submit"
              type="submit"
            />
          </div>
        </form>
      </div>
    );
  }
}

SearchInput.propTypes = {
  search: PropTypes.string
}

const mapStateToProps = state => {
  return {
    search: state.search,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign(
    {},
    SearchActions,
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchInput);
