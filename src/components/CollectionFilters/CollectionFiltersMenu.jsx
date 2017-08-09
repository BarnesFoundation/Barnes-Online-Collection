import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import CollectionFiltersMenuItem from './CollectionFiltersMenuItem';

class CollectionFiltersMenu extends Component {
  render() {
    const filterOptions = this.props.filters.filterOptions;
    return (
      <div>
        {
          Object
          .keys(filterOptions)
          .map(key =>
            <CollectionFiltersMenuItem
              key={key}
              title={filterOptions[key].title}
              name={filterOptions[key].slug}
              selectFilter={this.props.selectFilter}
            />
          )
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    filters: state.filters
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign(
    {},
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionFiltersMenu);
