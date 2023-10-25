import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Filter from './Filter';
import MediaQuery from 'react-responsive';
import { BREAKPOINTS } from '../../constants';

class SpaceFilters extends Component {
  buildFilter () {
    const filter = this.props.filterSets.sets.space.filter;
    return <Filter filter={filter} />;
  }

  render () {
    return (
      <div className='space-filters-container'>
        <MediaQuery maxWidth={BREAKPOINTS.tablet_max}>
          <div className="mobile-filters-section">
            <h6 className="mobile-filters-header font-zeta">Space</h6>
            {this.buildFilter()}
          </div>
        </MediaQuery>
        <MediaQuery minWidth={BREAKPOINTS.tablet_max + 1}>
          {this.buildFilter()}
        </MediaQuery>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    filterSets: state.filterSets
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign({}), dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SpaceFilters);
