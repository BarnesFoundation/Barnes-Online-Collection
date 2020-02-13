import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { Dropdowns } from './Dropdowns';
import { BREAKPOINTS } from '../../constants';
import * as SearchActions from '../../actions/search';
import MobilePanelCloseButton from '../CollectionFilters/MobilePanelCloseButton';

import './searchInput.css';

class SearchInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      isFocused: true,
    };
  }

  /**
   * If enter key is pressed and search is focused, execute search.
   */
  searchOnEnter = (e) => {
    const { isFocused } = this.state;

    if (e.key === 'Enter' && isFocused) {
      this.submit();
    }
  };

  /**
   * Add event listener for pressing enter on mount and cleanup event listener on unmount.
   */
  componentDidMount() { window.addEventListener('keydown', this.searchOnEnter); }
  componentWillUnmount() { window.removeEventListener('keydown', this.searchOnEnter); }

  onChange = ({ target: { value }}) => this.setState({ value });
  setFocus = isFocused => this.setState({ isFocused }); // Set focus

  /**
   * Submit search.
   * @param {SyntheticEvent?} - optional event, depending if this was from button or from enter press.
   */
  submit = (e) => {
    if (e) e.preventDefault();

    this.props.addSearchTerm(this.state.value);
    this.setState({ value: '' });
  };

  render() {
    
    return (
      <div>
        {/* <MediaQuery maxWidth={BREAKPOINTS.tablet_max}>
          <div className='mobile-filters-section search-input'>
            <form className='mobile-filters-form' onSubmit={this.handleSubmit}>
              <div className='form-field'>
                <input
                  className='input mobile'
                  type='text'
                  value={this.state.value}
                  placeholder='Search a keyword, artist, room number, and more'
                  onChange={this.onChange}
                />
                <MobilePanelCloseButton />
              </div>
            </form>
          </div>
        </MediaQuery> */}

        {/* <MediaQuery minWidth={BREAKPOINTS.tablet_max}> */}
          <div className='search'>
            <div className='search__content'>
              <div className='search__searchbar'>
                <input
                  className='search__input'
                  type='text'
                  autoFocus='true'
                  value={this.state.value}
                  placeholder='Search a keyword, artist, room number, and more'
                  onChange={this.onChange}
                  onFocus={() => this.setFocus(true)}
                  onBlur={() => this.setFocus(false)}
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
                <Dropdowns />
              </div>
            </div>
          </div>
        {/* </MediaQuery> */}
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
