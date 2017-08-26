import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import MediaQuery from 'react-responsive';

import LineFilter from './LineFilter';

class LineFilters extends Component {
  buildFilters(type) {

    const filters = this.props.filterSets.sets.lines.options[type];

    return (
      filters.map((option, index) => {
        return (
          <LineFilter
            key={index}
            index={index}
            filter={option}
          />
        );
      })
    );
  }

  render() {
    return (
      <div className='line-filters-container'>
        <MediaQuery minWidth={426}>
          <div>{this.buildFilters('composition')}</div>
          <div>{this.buildFilters('linearity')}</div>
        </MediaQuery>
        <MediaQuery maxWidth={425}>
          <div className="mobile-filter-section">
            <h6 className="mobile-filter-header font-zeta">Lines</h6>
            <div>{this.buildFilters('composition')}</div>
            <div>{this.buildFilters('linearity')}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(LineFilters);
