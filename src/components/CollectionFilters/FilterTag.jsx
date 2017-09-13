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

  getFilterIcon() {
    if (this.props.filter.filterType === 'color') {
      return <span className="color-filter-icon" style={{background: this.props.filter.color}}></span>;
    } else {
      return <Icon svgId={this.props.filter.svgId} classes='collection-filter-icon' />;
    }
  }

  handleClick(event) {
    event.preventDefault();
    this.props.removeFilter(this.props.filter);
  }

  render() {
    return (
      <button className="applied-filter-tag" onClick={this.handleClick}>
        {this.getFilterIcon()}
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
