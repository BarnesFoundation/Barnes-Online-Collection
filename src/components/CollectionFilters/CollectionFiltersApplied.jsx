import React from 'react';
import { connect } from 'react-redux';
import FilterTag from './FilterTag';

const CollectionFiltersApplied = ({ ordered, orderedAdvanced, objectsCount, isSearchPending }) => {
  const mergedOrders = [
    ...ordered,
    ...orderedAdvanced.map(order => ({ ...order, isAdvanced: true })), // So we know that this is an advanced filter.
  ].sort((orderA, orderB) => orderA.index - orderB.index) // Sort by index key.

  return (
    Boolean(ordered.length || orderedAdvanced.length) && 
      <div className='applied-filter-tags-container-wrap'>
        <div className='applied-filter-tags-container'>
          {mergedOrders.map((filter) => (
            <FilterTag
              advancedFilter={Boolean(filter.isAdvanced)}
              key={filter.index}
              filter={filter}
            />)
          )}
        </div>
        <div className='applied-filter-tags-container-wrap__count'>
          {Boolean(objectsCount && !isSearchPending) && `${objectsCount} Results`}
        </div>
      </div>
  );
}

const mapStateToProps = (state) => ({
  ordered: state.filters.ordered,
  orderedAdvanced: Object.values(state.filters.advancedFilters)
    .flatMap(value => Object.values(value)),
  objectsCount: state.objectsQuery.lastIndex,
  isSearchPending: state.objectsQuery.isPending,
});

export default connect(mapStateToProps)(CollectionFiltersApplied);
