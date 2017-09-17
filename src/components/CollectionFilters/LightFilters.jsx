import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Filter from './Filter';
import MediaQuery from 'react-responsive';

class LightFilters extends Component {
  buildFilter() {
    const filter = this.props.filterSets.sets.light.filter;
    return <Filter filter={filter}/>;
  }

  render() {
    return (
      <div className='light-filters-container'>
        <MediaQuery maxWidth={425}>
          <div className="mobile-filters-section">
            <h6 className="mobile-filters-header font-zeta">Light</h6>
            {this.buildFilter()}
          </div>
        </MediaQuery>
        <MediaQuery minWidth={426}>
          {this.buildFilter()}
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
