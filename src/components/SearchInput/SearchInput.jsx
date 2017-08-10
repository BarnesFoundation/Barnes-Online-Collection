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
    this.props.search(this.state.value);
    this.setState({value: ''});
  }

  render() {
    return (
      <section aria-label="search" className="searchbar">
        <form className="searchbar__container" onSubmit={this.handleSubmit}>
          <input
            type="text"
            autoFocus="true"
            value={this.state.value}
            onChange={this.handleChange}
            className="searchbar__input"
          />
        </form>
      </section>
    );
  }
}

SearchInput.propTypes = {
  queries: PropTypes.array
}

const mapStateToProps = state => {
  return {
    search: state.search
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign(
    {},
    SearchActions
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchInput);
