import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ColorFilter from './ColorFilter';

class ColorFilters extends Component {
  buildFilters() {
    const colorFilters = this.props.filterSets.sets.colors.options;
    return colorFilters.map((option, index) => {
      return (
        <ColorFilter
          key={index}
          index={index}
          filter={option}
        />
      );
    });
  }
  render() {

    return (
      <div className='color-filters-container'>
        {this.buildFilters()}
      </div>
    );
  }
}


const mapStateToProps = state => {
  return {
    filterSets: state.filterSets
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign({}), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ColorFilters);
