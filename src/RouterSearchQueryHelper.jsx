import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import queryString from 'query-string';
import * as ObjectsActions from './actions/objects';
import * as FilterSetsActions from './actions/filterSets';
import * as FiltersActions from './actions/filters';
import * as SearchActions from './actions/search';
import { getQueryKeywordUrl, getQueryFilterUrl } from './helpers';
import { withRouter } from 'react-router'
import { DEV_WARN } from './devLogging';

// const queryString = require('query-string');

class RouterSearchQueryHelper extends Component {
  componentWillMount() {
    this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(null);
  }

  getInitialQuery() {
    const parsedQuery = queryString.parse(this.props.location.search);
    const queryType = parsedQuery.qtype || '';
    const queryVal = parsedQuery.qval || '';
    const querySearchIsValid = (queryType === 'filter' || queryType === 'keyword') &&
      queryVal.length > 0;

    return querySearchIsValid ? {
      queryType: queryType,
      queryVal: queryVal,
    } : null;
  }

  setInitialQueryOnLoad(initialQuery) {
    const queryType = initialQuery.queryType;
    const queryVal = initialQuery.queryVal;

    if (queryType === 'filter') {
      this.setInitialFilterSearch(queryVal);
    } else if (queryType === 'keyword') {
      this.props.addSearchTerm(queryVal);
    }
  }

  setInitialFilterSearch(queryVal) {
    let filterSelection = {};

    try {
      filterSelection = JSON.parse(queryVal);
    } catch (e) {
      DEV_WARN('invalid search syntax in the url');
    }

    this.props.setFilters(filterSelection);
  }

  componentDidUpdate() {
    const {
      search,
      filters,
      location: { state: newState } // For detecting if a modal is open.
    } = this.props;

    // If a modal is open, just return;
    if (newState && newState.isModal) return;

    const { qtype: queryType, qval: queryVal } = queryString.parse(this.props.location.search);

    if (Boolean(search.length)) {
      if (search !== queryVal) {
        this.props.history.push(getQueryKeywordUrl(search));
      }
    } else if (Boolean(filters.ordered && filters.ordered.length)) {

      // Reduce and stringify filter state to compare with queryVal.
      const filtersVal = JSON.stringify(filters.ordered.reduce((acc, filter) => ({
        // For lines and colors we just use the name and for space and light we use the value.
        ...acc, [filter.filterType]: filter.value || filter.name,
      }), {}));

      if (filtersVal !== queryVal) this.props.history.push(getQueryFilterUrl(filtersVal));

    } else if (queryType) {
      // there's no search or Filters, so the query url needs to be cleared.
      this.props.history.push(``);
    }
  }

  runSearchQueryOrDeferredFetch(deferredFetch) {
    const initialQuery = this.getInitialQuery();
    
    if (initialQuery) {
      this.setInitialQueryOnLoad(initialQuery);
    } else if (deferredFetch) {
      deferredFetch();
    }
  }

  render() {
    return <div className="" />
  }
}

function mapStateToProps(state) {
  return {
    modalIsOpen: state.modal.modalIsOpen,
    modal: state.modal,
    filters: state.filters,
    search: state.search,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({},
    ObjectsActions,
    FilterSetsActions,
    FiltersActions,
    SearchActions,
  ), dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RouterSearchQueryHelper));
