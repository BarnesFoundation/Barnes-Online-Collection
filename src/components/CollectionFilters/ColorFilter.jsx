import React, { Component } from 'react';

// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';

// import * as FiltersActions from '../../actions/filters';
// import * as FilterSetsActions from '../../actions/filterSets';

class ColorFilter extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  // filterIsApplied() {
  //   const filters = this.props.filters.colors;
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
    //   this.props.addColorFilter(filter);
    // } else {
    //   const index = this.filterIsApplied();
    //   if (index === -1) {
    //     this.props.addColorFilter(filter);
    //   } else {
    //     this.props.removeColorFilter(filter);
    //   }
    // }
  }

  // getClasses() {
  //   const filter = this.props.filter;
  //   let classes = 'btn color-filter color-filter__' + filter.name;

  //   if (this.filterIsApplied() > -1) {
  //     classes += ' is-applied';
  //   }

  //   return classes;
  // }

  render() {
    return (
      <button
        onClick={this.handleClick}
        // style={{background: this.props.filter.color}}
        style={this.props.style}
        // className={this.getClasses()}
        className={this.props.classes}
      ></button>
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

// export default connect(mapStateToProps, mapDispatchToProps)(ColorFilter);

export default ColorFilter;
