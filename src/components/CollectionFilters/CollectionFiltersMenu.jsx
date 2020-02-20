import React from 'react';
import { connect } from 'react-redux';
import CollectionFiltersMenuItem from './CollectionFiltersMenuItem';

const CollectionFiltersMenu = ({ sets, parentContainer } ) => (
  <div
    className='container collection-filters-container'
    // onClick, scroll parent ref into view.  This is a ref to prevent weird height issues w/ absolutely positioned content.
    // This is wrapped in a RAF to prevent no scroll on clicking Search button.
    onClick={() => {
      requestAnimationFrame(() => {
        if (parentContainer) parentContainer.scrollIntoView({ behavior: 'smooth' });
      })
    }}
  >
    <div className='collection-filters'>
      {Object.entries(sets)
          .map(([key, { title, slug, svgId, tooltip }]) => (
            <CollectionFiltersMenuItem
              key={key}
              title={title}
              slug={slug}
              svgId={svgId}
              tooltip={tooltip}
            />
          ))}
    </div>
  </div>
);

const mapStateToProps = state => ({ sets: state.filterSets.sets });
export default connect(mapStateToProps)(CollectionFiltersMenu);
