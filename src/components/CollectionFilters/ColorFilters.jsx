import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import MediaQuery from 'react-responsive';
import { BREAKPOINTS } from '../../constants';
import Filter from './Filter';

class ColorFilters extends Component {
  buildFilters() {
    return this.props.filterSets.sets.colors.options.map((option, index) => (
      <Filter
        key={index}
        index={index}
        filter={option}
      />
    ));
  }

  render() {
    return (
      <div>
        <MediaQuery minWidth={BREAKPOINTS.tablet_max + 1}>
          <div className="color-filters-container">
            {this.buildFilters()}
          </div>
        </MediaQuery>
        <MediaQuery maxWidth={BREAKPOINTS.tablet_max}>
          <div className="mobile-filters-section">
            <h6 className="mobile-filters-header font-zeta">Colors</h6>
            <div className="color-filters-container">
              {this.buildFilters()}
            </div>
          </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ColorFilters);
