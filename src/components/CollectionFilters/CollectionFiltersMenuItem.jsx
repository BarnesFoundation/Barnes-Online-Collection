import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as FilterSetsActions from '../../actions/filterSets';

class CollectionFiltersMenuItem extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    this.props.selectFilterSet(this.props.slug);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.props.title}
      </button>
    );
  }
}

const mapStateToProps = state => {
  return {
    filterSets: state.filterSets
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign(
    {},
    FilterSetsActions
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionFiltersMenuItem);
