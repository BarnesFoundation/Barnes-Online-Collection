import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import MediaQuery from 'react-responsive';
import { BREAKPOINTS } from '../../constants';

import Filter from './Filter';

class LineFilters extends Component {
  buildFilters(type) {
    const filters = this.props.filterSets.sets.lines.options[type];


    return (
      filters.map((option, index) => {
        option.filterGroup = type;
        return (
          <Filter
            key={index}
            index={index}
            filter={option}
          />
        );
      })
    );
  }

  getLineFilters() {
    return (
      <div className="line-filters-container">
        <div className="line-filters-group">{this.buildFilters('composition')}</div>
        <div className="line-filters-group">{this.buildFilters('linearity')}</div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <MediaQuery minWidth={BREAKPOINTS.tablet_max + 1}>
          {this.getLineFilters()}
        </MediaQuery>
        <MediaQuery maxWidth={BREAKPOINTS.tablet_max}>
          <div className="mobile-filters-section">
            <h6 className="mobile-filters-header font-zeta">Lines</h6>
            {this.getLineFilters()}
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
