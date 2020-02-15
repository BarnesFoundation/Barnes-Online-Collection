import React from 'react';
import { connect } from 'react-redux';
import CollectionFiltersMenuItem from './CollectionFiltersMenuItem';

const CollectionFiltersMenu = ({ sets, parentContainer } ) => (
  <div
    className='collection-filters'
    // onClick, scroll parent ref into view.  This is a ref to prevent weird height issues w/ absolutely positioned content.
    // This is wrapped in a RAF to prevent no scroll on clicking Search button.
    onClick={() => requestAnimationFrame(() => parentContainer.scrollIntoView({ behavior: 'smooth' }))}
  >
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
);

const mapStateToProps = (state) => ({ sets: state.filterSets.sets });
export default connect(mapStateToProps)(CollectionFiltersMenu);
