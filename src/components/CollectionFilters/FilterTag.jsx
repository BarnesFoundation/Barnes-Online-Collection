import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Icon from '../Icon.jsx';
import * as FiltersActions from '../../actions/filters';

class FilterTag extends Component {
  constructor(props) {
    super(props);
  }

  getFilterIcon() {
    if (this.props.filter.filterType === 'colors') {
      return <span className="color-filter-icon" style={{ background: this.props.filter.color }}></span>;
    } else if (this.props.filter.svgId) {
      return <Icon svgId={this.props.filter.svgId} classes='collection-filter-icon' />;
    } else {
      return null;
    }
  }

  getFilterContent() {
    if (this.props.filter.filterType === 'light' || this.props.filter.filterType === 'space') {
      return <span className="filter-tag-text">{this.props.filter.value}%</span>;
    } else if (this.props.filterType === 'search') {
      return <span className="filter-tag-text">"{this.props.filter.value}"</span>;
    }
  }

  handleClick = (e) => {
    e.preventDefault();
    this.props.removeFilter(this.props.filter);
  }

  render() {
    return (
      <button
        className={`applied-filter-tag applied-filter-tag-${this.props.filter.filterType}`}
        onClick={this.handleClick}
      >
        {this.getFilterIcon()}
        {this.getFilterContent()}
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
