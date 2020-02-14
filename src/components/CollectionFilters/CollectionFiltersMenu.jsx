import React from 'react';
import { connect } from 'react-redux';
import CollectionFiltersMenuItem from './CollectionFiltersMenuItem';

// import ReactTooltip from 'react-tooltip';

const CollectionFiltersMenu = ({ sets, parentContainer } ) => (
  <div
    className='collection-filters'
    onClick={() => parentContainer.scrollIntoView({ behavior: 'smooth' })}
  >
    {/* <ReactTooltip id="collectionFilterMenuItem" effect="solid"/> */}
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
