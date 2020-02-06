import React from 'react';
import { connect } from 'react-redux';
import ClearAllButton from '../SearchInput/ClearAllButton'
import MobilePanelShuffleButton from './MobilePanelShuffleButton'
import FilterTag from './FilterTag';

const CollectionFiltersApplied = ({ ordered }) => (
  Boolean(ordered.length) && 
    <div className="applied-filter-tags-container-wrap">
      <div className="flex-left">
        <div className="applied-filter-tags-container">
          {ordered.map((filter, index) => (
            <FilterTag
              key={index}
              index={index}
              filter={filter}
            />)
          )}
        </div>
      </div>
      <div className="flex-right">
        <ClearAllButton />
        <MobilePanelShuffleButton />
      </div>
    </div>
);

const mapStateToProps = state => ({ ordered: state.filters.ordered });

export default connect(mapStateToProps)(CollectionFiltersApplied);
