import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as SearchActions from '../../actions/search';
import * as ObjectsActions from '../../actions/objects';

class SearchApplied extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.clearSearchTerm();
    this.props.getAllObjects();
  }
  render() {
    return (
      <div className="search-results">
        <p>Results for "{this.props.search}"</p>
        <button
          onClick={this.handleClick}
          className="btn">Clear all</button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    search: state.search,
  }
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Object.assign({},
    SearchActions,
    ObjectsActions
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchApplied);

