import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import MediaQuery from 'react-responsive';

class LightFilters extends Component {
  sliderLabel(text) {
    return <p className="slider-label font-smallprint">{text}</p>;
  }

  getLightFilters() {
    return (
      <div className='light-filters-container'>
        <MediaQuery minWidth={426}>{this.sliderLabel('Diffused')}</MediaQuery>
        <input
          className="slider"
          type="range" min="0" max="100"
          defaultValue="50"
        />
        <MediaQuery maxWidth={425}>{this.sliderLabel('Diffused')}</MediaQuery>
        {this.sliderLabel('Light')}
      </div>
    );
  }

  render() {
    return (
      <div>
        <MediaQuery maxWidth={425}>
          <div className="mobile-filters-section">
            <h6 className="mobile-filters-header font-zeta">Light</h6>
            {this.getLightFilters()}
          </div>
        </MediaQuery>
        <MediaQuery minWidth={426}>
          {this.getLightFilters()}
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

export default connect(mapStateToProps, mapDispatchToProps)(LightFilters);
