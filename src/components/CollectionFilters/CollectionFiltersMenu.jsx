import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import CollectionFiltersMenuItem from './CollectionFiltersMenuItem';

class CollectionFiltersMenu extends Component {
  render() {
    const filterSets = this.props.filterSets.sets;
    return (
      <div>
        {
          Object
          .keys(filterSets)
          .map(key =>
            <CollectionFiltersMenuItem
              key={key}
              title={filterSets[key].title}
              slug={filterSets[key].slug}
            />
          )
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(CollectionFiltersMenu);
