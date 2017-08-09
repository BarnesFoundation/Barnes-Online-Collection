import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import QueryTag from './QueryTag';

import * as QueriesActions from '../../actions/queries';
import * as ObjectsActions from '../../actions/objects';

class CollectionFiltersApplied extends Component {
  buildQueryTags(queries) {
    return queries.map((query, index) =>
      <QueryTag key={index} index={index} value={query[2]} />
    );
  }

  buildFilterTags(filters) {
    return filters.map((filter, index) =>
      <QueryTag key={index} index={index} value={filter[2]} />
    );
  }

  componentWillUpdate(nextProps) {
    if (this.props.queries.length !== nextProps.queries.length || this.props.filters.filtersApplied.length !== nextProps.filters.filtersApplied.length) {
      this.props.findFilteredObjects(nextProps.queries, nextProps.filters);
    }
  }

  render() {
    return (
      <div>
        {this.buildQueryTags(this.props.queries)}
        {this.buildFilterTags(this.props.filters.filtersApplied)}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    queries: state.queries,
    filters: state.filters,
  }
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign({},
    QueriesActions,
    ObjectsActions
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionFiltersApplied);
