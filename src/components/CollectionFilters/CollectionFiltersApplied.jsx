import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as QueryActions from '../../actions/query';

class CollectionFiltersApplied extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <p>CollectionFiltersApplied</p>
        <p>{this.props.query}</p>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    query: state.query
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, QueryActions), dispatch);
}

export default CollectionFiltersApplied;
