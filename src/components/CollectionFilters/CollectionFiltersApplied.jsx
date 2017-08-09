import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import QueryTag from './QueryTag';

import * as QueriesActions from '../../actions/queries';

class CollectionFiltersApplied extends Component {
  buildQueryTags(queries) {
    return queries.map((query, index) =>
      <QueryTag key={index} index={index} value={query[2]} />
    );
  }

  render() {
    return (
      <div>
        {this.buildQueryTags(this.props.queries)}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    queries: state.queries,
  }
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign({}, QueriesActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionFiltersApplied);
