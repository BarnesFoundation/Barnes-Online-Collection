import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Icon from '../Icon.jsx';

import * as FiltersActions from '../../actions/filters';

class FilterTag extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.preventDefault();
    // switch(this.props.filter.filterType) {
    //   case 'color':
    //     this.props.removeColorFilter(this.props.filter);
    //     break;
    //   default:
    //     this.props.removeFilterByIndex(this.props.index);
    // }
    this.props.removeFilter(this.props.filter);
  }

  render() {
    return (
      <button className="applied-filter-tag" onClick={this.handleClick}>
        <Icon svgId={this.props.filter.svgId} classes='collection-filter-icon' />
        <Icon svgId='cross_tag' classes='icon-cross-tag'/>
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
