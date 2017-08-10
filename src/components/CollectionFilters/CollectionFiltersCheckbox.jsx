import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as FiltersActions from '../../actions/filters';
import * as FilterSetsActions from '../../actions/filterSets';
import * as SearchActions from '../../actions/search';

class CollectionFiltersCheckbox extends Component {
  constructor(props) {
    super(props);

    this.state = { selected: false };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.preventDefault();

    const filter = this.props.filter;
    let selected = this.state.selected;

    if (!selected) {
      this.props.clearSearchTerm();
      this.props.addToFilters(filter);
    } else {
      this.props.removeFilterBySlug(filter.slug);
    }

    this.setState({ selected: !selected })
  }

  render() {
    const value = this.props.filter.displayValue;
    return (
      <button
        onClick={this.handleClick}
        //Temporary styling for dramatic effect.
        style={{background: value, color: 'white'}}>
        {value}
      </button>
    );
  }
}

const mapStateToProps = state => {
  return {
    // filterSets: state.filterSets,
    filters: state.filters,
    // search: state.search
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign({},
    FiltersActions,
    FilterSetsActions,
    SearchActions,
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionFiltersCheckbox);
