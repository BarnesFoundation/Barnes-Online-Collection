import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Masonry from 'react-masonry-component';
import ArtObject from '../ArtObject/ArtObject';
import SpinnerLoader from './SpinnerLoader';
import CollectionFiltersApplied from '../CollectionFilters/CollectionFiltersApplied';
import { clearObject } from '../../actions/object';
import { getNextObjects } from '../../actions/objects';
import { getArtObjectUrlFromId } from '../../helpers';
import ensembleIndexes from '../../ensembleIndexes';
import { ART_OBJECT_GRID_INCREMENT } from '../../constants';
import { DROPDOWN_TERMS } from '../SearchInput/Dropdowns/Dropdowns';
import './searchResultsGrid.css';
import './artObjectGrid.css';

/** View more button component. */
const ViewMoreButton = ({ onClick }) => (
  <div className='view-more-button m-block m-block--no-border m-block--flush-bottom'>
    <button
      className='btn btn--view-more'
      onClick={({ target }) => {
        onClick(); // Perform onClick prop.
        target.blur(); // Unfocus to remove styling.
      }}
    >
      View More
    </button>
  </div>
);

/** Masonry grid component. */
const masonryOptions = { transitionDuration: 0 };
const MasonryGrid = ({ children }) => (
  <Masonry
    className='component-masonry-grid'
    elementType={'ul'}
    options={masonryOptions}
    disableImagesLoaded={false}
    updateOnEachImageLoad={false}
  >
    {children}
  </Masonry>
);

/**
 * Search results grid component.
 * @see searchResultsGrid.scss for styling.
 * */
const SearchResultsGrid = ({ children, isRoomResult }) => (
  <div className={!isRoomResult ? 'search-results-grid' : null}>
      {children}
  </div>
);

/** Masonry grid element. */
const GridListElement = ({
  object,
  shouldLinksUseModal,
  modalPreviousLocation,
  clearObject,
  isFilterResult,
  isSearchResult
}) => {
  let gridListElementClassNames = 'masonry-grid-element';
  if (isFilterResult) gridListElementClassNames = `${gridListElementClassNames} search-results-grid__element`;

  return (
    <li className={gridListElementClassNames}>
      <Link
        to={{
          pathname: getArtObjectUrlFromId(object.id, object.title),
          state: {
            isModal: shouldLinksUseModal || Boolean(modalPreviousLocation),
            modalPreviousLocation
          }
        }}
        onClick={() => {
          // Clear the object right away to avoid a FOUC while the new object loads.
          clearObject();

          if (!shouldLinksUseModal) {
            window.scrollTo(0, 0);
          }
        }}
        className='grid-list-el'
      >
        <ArtObject
          key={object.id}
          title={object.title}
          people={object.people}
          medium={object.medium}
          imageUrlSmall={object.imageUrlSmall}
          imageUrlLarge={object.imageUrlLarge}

          // Only pass highlight if this is for search results.
          highlight={(isSearchResult) ? object.highlight : null}
        />
      </Link>
    </li>
  );
};

/**
 * Class to manage converting raw object[] data into a masonry grid.
 */
class ArtObjectGrid extends Component {
  constructor (props) {
    super(props);

    // For 'View More' results.
    this.state = {
      truncateThreshold: ART_OBJECT_GRID_INCREMENT
    };
  }

  /**
   * Set reset truncate if prop exists.
   */
  componentDidMount () {
    const { setResetTruncateThreshold } = this.props;

    if (setResetTruncateThreshold) {
      setResetTruncateThreshold(() => this.setState({ truncateThreshold: ART_OBJECT_GRID_INCREMENT }));
    }
  }

  /**
   * Increase number of art objects shown in grid.
   */
  incrementTruncateThreshold = () => {
    const { getNextObjects } = this.props;
    const { truncateThreshold } = this.state;

    getNextObjects(truncateThreshold + ART_OBJECT_GRID_INCREMENT);
    this.setState({ ...this.state, truncateThreshold: truncateThreshold + ART_OBJECT_GRID_INCREMENT });
  };

  render () {
    // Destructure props.
    const {
      // For masonry grid display.
      isSearchPending,
      hasMoreResults,
      gridStyle,

      // Props for GridListElement.
      liveObjects,
      shouldLinksUseModal,
      modalPreviousLocation,
      clearObject,

      // For detecting if a search or location filter has been placed.
      hasSearch,
      hasFilter,
      hasRoom
    } = this.props;

    // Searching is rendered on default, on false body will render.
    const searching = isSearchPending && <SpinnerLoader />;
    const isSearchResult = Boolean(shouldLinksUseModal && hasSearch);
    const isFilterResult = Boolean(shouldLinksUseModal && hasFilter);
    const isRoomResult = Boolean(shouldLinksUseModal && hasRoom);

    // Convert object[] to an array of ArtObjects wrapped in Links.
    const uncutMasonryElements = isRoomResult
      ? Object.entries(
        liveObjects.reduce((acc, object) => ({ // Put liveObjects into bucket according to ensemble index.
          ...acc,
          [object.ensembleIndex]: acc[object.ensembleIndex] ? [...acc[object.ensembleIndex], object] : [object]
        }), {})
      )
        .sort(([keyA], [keyB]) => keyA - keyB) // Reverse sort keys by number to guarantee render in order.
        .filter(([key]) => ensembleIndexes[key]) // Filter out any items w/ no matching ensemble index.
        .map(([key, value]) => (
          <div
            className='location-results'
            key={`${ensembleIndexes[key].roomTitle}, ${ensembleIndexes[key].wallTitle}`}
          >
            <h3 className='font-delta location-results__header'>
              {ensembleIndexes[key].roomTitle}{ensembleIndexes[key].wallTitle ? `, ${ensembleIndexes[key].wallTitle}` : ''}
            </h3>
            <div className='search-results-grid'>
              {value.map((object) => (
                <GridListElement
                  key={object.id}
                  object={object}
                  shouldLinksUseModal={shouldLinksUseModal}
                  modalPreviousLocation={modalPreviousLocation}
                  clearObject={clearObject}
                  isFilterResult={true}
                  isSearchResult={isSearchResult}
                />))}
            </div>
          </div>
        ))
      : liveObjects.map((object) => (
        <GridListElement
          key={object.id}
          object={object}
          shouldLinksUseModal={shouldLinksUseModal}
          modalPreviousLocation={modalPreviousLocation}
          clearObject={clearObject}
          isFilterResult={isFilterResult}
          isSearchResult={isSearchResult}
        />
      ));

    // If this is a 'View More' Grid, truncate results.
    // This will always be false if location filter is applied.
    const masonryElements = (hasMoreResults && !isRoomResult)
      ? uncutMasonryElements.slice(0, this.state.truncateThreshold)
      : uncutMasonryElements;

    // Get type of display, if this is the landing page and a search has been submitted, return formatted results.
    // TODO => This should just return wrapper element, but returning MasonryGrid causes MasonryGrid to only have a single column.
    const displayGrid = (isFilterResult || isRoomResult)
      ? (
      <SearchResultsGrid isRoomResult={isRoomResult}>
        {masonryElements}
      </SearchResultsGrid>
        )
      : (
        <MasonryGrid>
          {masonryElements}
        </MasonryGrid>
        );

    let bodyClass = 'component-art-object-grid-results';
    if (shouldLinksUseModal) bodyClass = `${bodyClass} component-art-object-grid-results--landing-page`;

    // Body is only rendered if searching is falsy.
    const body = (masonryElements && masonryElements.length)
      ? (<div>
        <div className={bodyClass}>
          {displayGrid}
          {Boolean(
            hasMoreResults &&
              uncutMasonryElements.length !== masonryElements.length &&
              !isRoomResult
          ) &&
            <ViewMoreButton onClick={this.incrementTruncateThreshold}
          />}
        </div>
      </div>)
      : (<div className='m-block no-results'>
        <img className='no-results-image' width={140} src='/images/sad-face.svg' alt='no results icon' />
        <div className='no-results-message'>
          No results for this search.
        </div>
      </div>);

    return (
      <div className='m-block m-block--shallow m-block--no-border m-block--flush-top component-art-object-grid__wrapper'>
        {shouldLinksUseModal && <CollectionFiltersApplied />}
        <div
          className={`
            component-art-object-grid
            ${masonryElements.length ? 'has-elements' : ''}
            ${isSearchPending ? 'is-pending' : ''}
          `}
          data-grid-style={gridStyle}
        >
            {searching || body}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  object: state.object,
  hasSearch: Boolean(state.filters.search),

  // If this is a search via filter.
  hasFilter: Boolean(
    state.filters.ordered.length ||
    Object.values(state.filters.advancedFilters)
      .some(advancedFilter => Object.keys(advancedFilter).length)
  ),

  // If this is specifically a location search.
  hasRoom: Boolean(
    state.filters.advancedFilters[DROPDOWN_TERMS.ROOM] &&
    Object.keys(state.filters.advancedFilters[DROPDOWN_TERMS.ROOM]).length
  )
});
const mapDispatchToProps = dispatch => bindActionCreators(Object.assign({}, { clearObject, getNextObjects }), dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ArtObjectGrid);
