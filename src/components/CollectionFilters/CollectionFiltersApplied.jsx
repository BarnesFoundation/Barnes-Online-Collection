import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as QueriesActions from '../../actions/queries';

class CollectionFiltersApplied extends Component {
  render() {
    const queries = this.props.queries;
    const queryTags = queries.map((query, index) =>
      <button key={index}>{query[2]}</button>
    );

    return (
      <div>
        {queryTags}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    queries: state.queries,
    filters: state.filters
  }
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign({}, QueriesActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionFiltersApplied);
