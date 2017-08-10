import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as FiltersActions from '../../actions/filters';

class FilterTag extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    this.props.removeFilterByIndex(this.props.index);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.props.displayValue} X
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
  return bindActionCreators(Object.assign({},
    FiltersActions,
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterTag);
