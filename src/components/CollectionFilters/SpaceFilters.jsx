import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import MediaQuery from 'react-responsive';
import Slider from '../Slider/Slider.jsx';

class SpaceFilters extends Component {
  getSpaceFilters() {
    return (
      <Slider
        labelStyle="inline"
        labelLeft="Shallow"
        labelRight="Deep"
      />
    );
  }

  render() {
    return (
      <div className='space-filters-container'>
        <MediaQuery maxWidth={425}>
          <div className="mobile-filters-section">
            <h6 className="mobile-filters-header font-zeta">Space</h6>
            {this.getSpaceFilters()}
          </div>
        </MediaQuery>
        <MediaQuery minWidth={426}>
          {this.getSpaceFilters()}
        </MediaQuery>
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
