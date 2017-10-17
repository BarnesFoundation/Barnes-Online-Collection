import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import MediaQuery from 'react-responsive';
import { BREAKPOINTS } from '../../constants';

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
      <div>
        <MediaQuery maxWidth={BREAKPOINTS.tablet_max}>
          <div className="mobile-filters-section search-input">
            <h6 className="mobile-filters-header font-zeta">Search</h6>
            <form onSubmit={this.handleSubmit}>
              <div className="form-field">
                <input
                  className="input mobile"
                  type="text"
                  value={this.state.value}
                  placeholder="Search a keyword, artist…"
                  onChange={this.handleChange}
                />
              </div>
            </form>
          </div>
        </MediaQuery>

        <MediaQuery minWidth={BREAKPOINTS.tablet_max + 1}>
          <div className="search-input">
            <form onSubmit={this.handleSubmit}>
              <div className="form-field">
                <input
                  className="input"
                  type="text"
                  autoFocus="true"
                  value={this.state.value}
                  placeholder="Search a keyword, artist…"
                  onChange={this.handleChange}
                />
                <input
                  className="btn btn-no-style btn-submit"
                  type="submit"
                />
              </div>
            </form>
          </div>
        </MediaQuery>
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
