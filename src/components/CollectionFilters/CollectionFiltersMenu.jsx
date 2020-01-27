import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import CollectionFiltersMenuItem from './CollectionFiltersMenuItem';
import ReactTooltip from 'react-tooltip';

class CollectionFiltersMenu extends Component {
  render() {
    const filterSets = this.props.filterSets.sets;
    return (
      <div className='collection-filters'>
        <ReactTooltip id="collectionFilterMenuItem" effect="solid"/>
        {
          Object
          .keys(filterSets)
          .map(key =>
            <CollectionFiltersMenuItem
              key={key}
              title={filterSets[key].title}
              slug={filterSets[key].slug}
              svgId={filterSets[key].svgId}
              tooltip={filterSets[key].tooltip}
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
