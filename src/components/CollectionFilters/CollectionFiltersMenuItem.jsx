import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as FiltersActions from '../../actions/filters';

class CollectionFiltersMenuItem extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  // selectFilter(filterName) {
  //   const slug = filterName.toLowerCase();
  //   this.props.selectFilterSet(slug);
  // }

  handleClick(event) {
    const slug = this.props.name;
    this.props.selectFilterSet(slug);
  }

  render() {
    return (
      <button
        onClick={this.handleClick}
        name={this.props.name}
      >
        {this.props.title}
      </button>
    );
  }
}

const mapStateToProps = state => {
  return {
    filters: state.filters
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign(
    {},
    FiltersActions
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionFiltersMenuItem);
