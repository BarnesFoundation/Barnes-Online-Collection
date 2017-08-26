import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class LightFilters extends Component {
  render() {
    return (
      <div className='light-filters-container'>
        <p className="slider-label font-smallprint">Diffused</p>
        <input
          className="slider"
          type="range" min="0" max="100"
          defaultValue="50"
        />
        <p className="slider-label font-smallprint">Light</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(LightFilters);
