import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import MediaQuery from 'react-responsive';

class SpaceFilters extends Component {
  sliderLabel(text) {
    return <p className="slider-label font-smallprint">{text}</p>;
  }

  getSpaceFilters() {
    return (
      <div className='space-filters-container'>
        <MediaQuery minWidth={426}>{this.sliderLabel('Shallow')}</MediaQuery>
        <input
          className="slider"
          type="range" min="0" max="100"
          defaultValue="50"
        />
        <MediaQuery maxWidth={425}>{this.sliderLabel('Shallow')}</MediaQuery>
        {this.sliderLabel('Deep')}
      </div>
    );
  }

  render() {
    return (
      <div>
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
