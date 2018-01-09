import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// todo:
import * as ObjectsActions from './actions/objects';
import * as FilterSetsActions from './actions/filterSets';
import * as SearchActions from './actions/search';
import { withRouter } from 'react-router'

const queryString = require('query-string');

class RouterSearchQueryHelper extends Component {
  parseFilters(filters) {
    const parsedFilters = filters.map((filter) => {
      const hasValue = typeof filter.value !== 'undefined';

      // for lines and colors we just use the name
      // for space and light we use the value
      const value = hasValue ? filter.value : filter.name
      let ret = {};
      ret[filter.filterType] = value;
      return ret;
    });

    return JSON.stringify(parsedFilters);
  }

  componentDidUpdate(nextProps) {
    // this didn't work...
    // const modalIsOpen = this.state.isModal;

    // detect if just opened a modal. If so, just return;
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
    const filterSet = this.props.filterSets.visibleFilterSet;

    const hasSearch = searchTerm.length > 0;
    const hasFilters = filters.ordered && filters.ordered.length > 0;


    debugger;

    if (hasSearch) {
      if (searchTerm !== queryVal) {
        this.props.history.push(`?qtype=keyword&qval=${searchTerm}`);
      }
    } else if (hasFilters) {
      let filtersVal = this.parseFilters(filters.ordered);

      if (filtersVal !== queryVal) {
        this.props.history.push(`?qtype=filter&qval=${filtersVal}`);
      }
    } else if (queryType) {
      // there's no searchTerm or Filters, so the query url needs to be cleared.
      this.props.history.push(``);
    }

    // if (queryVal && queryVal !== searchTerm) {
    //   this.props.addSearchTerm(queryVal);
    //   this.props.selectFilterSet('search');
    // }
  }


  render() {
    return <div className="" />
  }
}

function mapStateToProps(state) {
  return {
    filterSets: state.filterSets,
    // ? todo
    // mobileFilters: state.mobileFilters,
    // mobileSearch: state.mobileSearch,
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
    SearchActions,
  ), dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RouterSearchQueryHelper));
