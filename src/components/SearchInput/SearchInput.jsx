import React, { Component } from 'react';
import { SearchBar } from './SearchBar';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Dropdowns } from './Dropdowns';
import { addSearchTerm } from '../../actions/search';
import './searchInput.css';

/*
// From old mobile design.
import MediaQuery from 'react-responsive';
import { BREAKPOINTS } from '../../constants';
import MobilePanelCloseButton from '../CollectionFilters/MobilePanelCloseButton';
*/
  
class SearchInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownsActive: false,
    };
  }

  render() {
    const { addSearchTerm } = this.props;
    const { dropdownsActive } = this.state;

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
              <SearchBar
                hasTooltip
                onFocus={() => {
                  this.setState({ dropdownsActive: true });
                }}
                submit={addSearchTerm}
                placeholder='Search a keyword, artist, room number, and more'
              />
              <div className='search__dropdowns'>
                <Dropdowns dropdownsActive={dropdownsActive}/>
              </div>
            </div>
          </div>
        {/* </MediaQuery> */}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({ search: state.search });
const mapDispatchToProps = (dispatch) => (bindActionCreators(Object.assign({}, { addSearchTerm }), dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(SearchInput);
