import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as QueriesActions from '../../actions/queries';

class CollectionFiltersApplied extends Component {
  render() {
    const queries = this.props.queries.map((query, index) =>
      <li key={index}>{query[2]}</li>
    );

    return (
      <div>
        <p>Filters Applied:</p>
        <ul>{queries}</ul>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    queries: state.queries
  }
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign({}, QueriesActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionFiltersApplied);
