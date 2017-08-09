import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as QueriesActions from '../../actions/queries';
import * as FiltersActions from '../../actions/filters';

class CollectionFiltersCheckbox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: false
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.preventDefault();
    this.props.addToFilters(this.props.query);
    // add/remove query to/from queries array
    // toggle 'selected' styling
  }

  render() {
    const value = this.props.value;
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
    filters: state.filters,
    queries: state.queries
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign({},
    QueriesActions,
    FiltersActions
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionFiltersCheckbox);
