import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { BREAKPOINTS } from '../../constants';
import * as SearchActions from '../../actions/search';
import MobilePanelCloseButton from '../CollectionFilters/MobilePanelCloseButton';

import './searchInput.css';

class SearchInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ''
    };
  }

  onChange = ({ target: { value }}) => {
    this.setState({ value });
  };

  submit = (e) => {
    e.preventDefault();

    this.props.addSearchTerm(this.state.value);
    this.setState({ value: '' });
  };

  render() {
    return (
      <div>
        <MediaQuery maxWidth={BREAKPOINTS.tablet_max}>
          <div className='mobile-filters-section search-input'>
            <form className='mobile-filters-form' onSubmit={this.handleSubmit}>
              <div className='form-field'>
                <input
                  className='input mobile'
                  type='text'
                  value={this.state.value}
                  placeholder='Search a keyword, artist…'
                  onChange={this.onChange}
                />
                <MobilePanelCloseButton />
              </div>
            </form>
          </div>
        </MediaQuery>

        <MediaQuery minWidth={BREAKPOINTS.tablet_max}>
          <div className='search'>
            <div className='search__content'>
              <div className='search__searchbar'>
                <input
                  className='search__input'
                  type='text'
                  autoFocus='true'
                  value={this.state.value}
                  placeholder='Search a keyword, artist…'
                  onChange={this.onChange}
                />
                <button
                  className='btn btn--primary search__button'
                  type='submit'
                  onClick={this.submit}
                >
                  Search
                </button>
              </div>
              <div className='search__dropdowns'>
                Dropdowns Will Go Here.
              </div>
            </div>
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
