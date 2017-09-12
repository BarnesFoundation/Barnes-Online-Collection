import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as FiltersActions from '../../actions/filters';
import * as FilterSetsActions from '../../actions/filterSets';

class LineFilter extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  // filterIsApplied() {
  //   const filters = this.props.filters;
  //   for (let i = 0; i < filters.length; i++) {
  //     if (filters[i].slug === this.props.filter.slug) {
  //       return i;
  //     }
  //   }
  //   return -1;
  // }

  handleClick(event) {
    event.preventDefault();
    this.props.handleClick();
    // const filter = this.props.filter;
    // if (this.props.filters.length === 0) {
    //   this.props.addToFilters(filter);
    // } else {
    //   const index = this.filterIsApplied();
    //   if (index === -1) {
    //     this.props.addToFilters(filter);
    //   } else {
    //     this.props.removeFilterByIndex(index);
    //   }
    // }
  }

  // getClasses() {
  //   const filter = this.props.filter;
  //   let classes = 'btn line-filter font-smallprint';
  //   if (this.filterIsApplied() > -1) {
  //     classes += ' is-applied';
  //   }
  //   return classes;
  // }

  render() {
    return (
      <button
        onClick={this.handleClick}
        // className={this.getClasses()}
        className={this.props.classes}
      >
        <svg className={`icon icon-${this.props.filter.svgId} collection-filter-icon`}>
          <use xlinkHref={`#icon-${this.props.filter.svgId}`}></use>
        </svg>
        {this.props.name}
      </button>
    );
  }
}

// const mapStateToProps = state => {
//   return {
//     filters: state.filters,
//   }
// }

// const mapDispatchToProps = dispatch => {
//   return bindActionCreators(Object.assign({},
//     FiltersActions,
//     FilterSetsActions,
//   ), dispatch);
// }

// export default connect(mapStateToProps, mapDispatchToProps)(LineFilter);

export default LineFilter;
