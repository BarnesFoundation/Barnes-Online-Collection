import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as FiltersActions from '../../actions/filters';

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

    const filter = {
      method: 'query',
      type: 'match',
      field: '_all',
      term: this.state.value,
      displayType: 'searchTerm',
      displayValue: this.state.value
    };

    this.props.addToFilters(filter);
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
    filters: state.filters
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign(
    {},
    FiltersActions
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchInput);
