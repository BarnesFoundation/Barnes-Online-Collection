import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ObjectsActions from './actions/objects';
import * as FilterSetsActions from './actions/filterSets';
import * as FiltersActions from './actions/filters';
import * as RouterSearchQuery from './actions/routerSearchQuery';
import * as SearchActions from './actions/search';
import { getQueryKeywordUrl, getQueryFilterUrl } from './helpers';
import { withRouter } from 'react-router'
import { DEV_WARN } from './devLogging';

const queryString = require('query-string');

class RouterSearchQueryHelper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      queryType: '',
      queryVal: '',
    };
  }

  componentWillMount() {
    // this needs to happen before the didMount
    // so that the routerSearchInit's state is set before the fetchObject calls in the didMount Phases
    this.getInitialQuery();
  }

  componentDidMount() {
    this.setInitialQueryOnLoad();
  }

  getInitialQuery() {
    const parsedQuery = queryString.parse(this.props.location.search);
    const queryType = parsedQuery.qtype || '';
    const queryVal = parsedQuery.qval || '';
    const querySearchIsValid = (queryType === 'filter' || queryType === 'keyword') &&
      queryVal.length > 0;

    if (querySearchIsValid) {
      this.setState({
        queryType: queryType,
        queryVal: queryVal,
      });

      this.props.routerSearchInit();
    }
  }

  setInitialQueryOnLoad() {
    const queryType = this.state.queryType;
    const queryVal = this.state.queryVal;

    if (queryType === 'filter') {
      this.setInitialFilterSearch(queryVal);
    } else if (queryType === 'keyword') {
      this.setInitialKeywordSearch(queryVal);
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

  setInitialKeywordSearch(queryVal) {
    this.props.addSearchTerm(queryVal);
  }

  parseFilters(filters) {
    const filterSelection = {};

    // build up filterSelection with the parsed data.
    filters.forEach((filter) => {
      const hasValue = typeof filter.value !== 'undefined';

      // for lines and colors we just use the name
      // for space and light we use the value
      const value = hasValue ? filter.value : filter.name

      filterSelection[filter.filterType] = value;
    });

    // return the stringify version of the filterSelection object
    return JSON.stringify(filterSelection);
  }

  componentDidUpdate(nextProps) {
    // detect if we just opened a modal. If so, just return;
    const newState = this.props.history.location.state;
    const modalIsOpen = newState && newState.isModal;

    if (modalIsOpen) {
      return;
    }

    const parsedQuery = queryString.parse(this.props.location.search);
    const queryType = parsedQuery.qtype;
    const queryVal = parsedQuery.qval;
    const searchTerm = this.props.search;
    const filters = this.props.filters;

    const hasSearch = searchTerm.length > 0;
    const hasFilters = filters.ordered && filters.ordered.length > 0;

    if (hasSearch) {
      if (searchTerm !== queryVal) {
        this.props.history.push(getQueryKeywordUrl(searchTerm));
      }
    } else if (hasFilters) {
      let filtersVal = this.parseFilters(filters.ordered);

      if (filtersVal !== queryVal) {
        this.props.history.push(getQueryFilterUrl(filtersVal));
      }
    } else if (queryType) {
      // there's no searchTerm or Filters, so the query url needs to be cleared.
      this.props.history.push(``);
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
    RouterSearchQuery,
    ObjectsActions,
    FilterSetsActions,
    FiltersActions,
    SearchActions,
  ), dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RouterSearchQueryHelper));
