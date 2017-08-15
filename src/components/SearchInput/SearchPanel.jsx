import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import SearchInput from './SearchInput';
import SearchApplied from './SearchApplied';

class SearchPanel extends Component {
  render() {
    return (
      <div>
        <SearchInput />
        <SearchApplied />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    search: state.search
  }
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Object.assign({},
  ),
  dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchPanel);
