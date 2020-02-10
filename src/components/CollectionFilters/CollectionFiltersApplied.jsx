import React from 'react';
import { connect } from 'react-redux';
import ClearAllButton from '../SearchInput/ClearAllButton';
import MobilePanelShuffleButton from './MobilePanelShuffleButton';
import FilterTag from './FilterTag';

const CollectionFiltersApplied = ({ ordered, orderedAdvanced }) => {
  const mergedOrders = [
    ...ordered,
    ...orderedAdvanced.map(order => ({ ...order, isAdvanced: true })), // So we know that this is an advanced filter.
  ].sort((orderA, orderB) => orderA.index - orderB.index) // Sort by index key.

  return (
    Boolean(ordered.length || orderedAdvanced.length) && 
      <div className="applied-filter-tags-container-wrap">
        <div className="flex-left">
          <div className="applied-filter-tags-container">
            {mergedOrders.map((filter) => (
              <FilterTag
                advancedFilter={Boolean(filter.isAdvanced)}
                key={filter.index}
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
}

const mapStateToProps = (state) => ({
  ordered: state.filters.ordered,
  orderedAdvanced: Object.values(state.filters.advancedFilters)
    .flatMap(value => Object.values(value))
});

export default connect(mapStateToProps)(CollectionFiltersApplied);
