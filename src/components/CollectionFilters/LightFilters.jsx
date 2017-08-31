import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Slider from '../Slider/Slider.jsx';
import MediaQuery from 'react-responsive';

class LightFilters extends Component {
  getLightFilters() {
    return (
      <Slider
        labelStyle="inline"
        labelLeft="Diffused"
        labelRight="Light"
      />
    );
  }

  render() {
    return (
      <div className='light-filters-container'>
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
