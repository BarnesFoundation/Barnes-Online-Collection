import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as QueriesActions from '../../actions/queries';
import * as ObjectsActions from '../../actions/objects';

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

    const query = ['match', '_all', this.state.value];
    this.props.addToQueries(query);

    this.setState({value: ''});
  }

  // componentWillUpdate(nextProps) {
  //   if (this.props.queries.length !== nextProps.queries.length) {
  //     this.props.findFilteredObjects(nextProps.queries, nextProps.filters);
  //   }
  // }

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
    queries: state.queries,
    filters: state.filters
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign(
    {},
    ObjectsActions,
    QueriesActions
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchInput);
