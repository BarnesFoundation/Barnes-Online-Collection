import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class SpaceFilters extends Component {
  render() {
    return (
      <div className='space-filters-container'>
        <p className="slider-label font-smallprint">Shallow</p>
        <input
          className="slider"
          type="range" min="0" max="100"
          defaultValue="50"
        />
        <p className="slider-label font-smallprint">Deep</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(SpaceFilters);
