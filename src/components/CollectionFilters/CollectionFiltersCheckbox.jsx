import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

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

    if (!this.state.selected) {
      this.props.addToFilters(this.props);
      this.setState({ selected: true });
    } else {
      this.props.removeFilterBySlug(this.props.slug);
      this.setState({ selected: false });
    }
  }

  render() {
    const value = this.props.displayValue;
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
    filterSets: state.filterSets,
    filters: state.filters,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign({},
    FiltersActions,
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionFiltersCheckbox);
