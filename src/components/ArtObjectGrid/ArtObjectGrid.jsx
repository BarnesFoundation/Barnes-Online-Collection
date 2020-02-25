import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Masonry from 'react-masonry-component';
import ArtObject from '../ArtObject/ArtObject';
import SpinnerLoader from './SpinnerLoader';
import CollectionFiltersApplied from '../CollectionFilters/CollectionFiltersApplied';
import { clearObject } from '../../actions/object';
import { getArtObjectUrlFromId } from '../../helpers';
import ensembleIndexes from '../../ensembleIndexes';
import './searchResultsGrid.css';
import './artObjectGrid.css';

/** View more button component. */
const ViewMoreButton = ({ onClick }) => (
  <div className='view-more-button m-block m-block--no-border m-block--flush-bottom'>
    <button
      className='btn'
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
const SearchResultsGrid = ({ children, isLocationResult }) => (
  <div className={!isLocationResult ? 'search-results-grid' : null}>
      {children}
  </div>
);

/** Masonry grid element. */
const GridListElement = ({
  object,
  shouldLinksUseModal,
  modalPreviousLocation,
  clearObject,
  isSearchResult
}) => {
  let gridListElementClassNames = 'masonry-grid-element';
  if (isSearchResult) gridListElementClassNames = `${gridListElementClassNames} search-results-grid__element`;

  return (
    <li className={gridListElementClassNames}>
      <Link
        to={{
          pathname: getArtObjectUrlFromId(object.id, object.title),
          state: {
            isModal: shouldLinksUseModal || Boolean(modalPreviousLocation),
            modalPreviousLocation: modalPreviousLocation
          },
        }}
        onClick={() => {
          // Clear the object right away to avoid a FOUC while the new object loads.
          if (shouldLinksUseModal) clearObject();
        }}
        className='grid-list-el'
      >
        <ArtObject
          key={object.id}
          title={object.title}
          people={object.people}
          medium={object.medium}
          imageUrlSmall={object.imageUrlSmall}

          // Only pass highlight if this is for search results.
          highlight={isSearchResult ? object.highlight : null}
        />
      </Link>
    </li>
  );
};

/**
 * Class to manage converting raw object[] data into a masonry grid.
 */
class ArtObjectGrid extends Component {
  constructor(props) {
    super(props);

    // For 'View More' results.
    this.state = {
      truncateThreshold: 12,
    };
  };

  incrementTruncateThreshold = () => {
    const { truncateThreshold } = this.state;
    this.setState({ ...this.state, truncateThreshold: truncateThreshold + 12 });
  };

  render() {
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
      hasLocation,
    } = this.props;

    // Searching is rendered on default, on false body will render.
    const searching = isSearchPending && <SpinnerLoader />;

    const isSearchResult = Boolean(shouldLinksUseModal && hasSearch);
    const isLocationResult = Boolean(shouldLinksUseModal && hasLocation);

    // Convert object[] to an array of ArtObjects wrapped in Links.
    const uncutMasonryElements = isLocationResult
      ? Object.entries(
          liveObjects.reduce((acc, object) => ({ // Put liveObjects into bucket according to ensemble index.
              ...acc,
              [object.ensembleIndex]: acc[object.ensembleIndex] ? [...acc[object.ensembleIndex], object] : [object]
            }), {})
        )
        .sort(([keyA], [keyB]) => keyA - keyB) // Reverse sort keys by number to guarantee render in order.
        .filter(([key]) => ensembleIndexes[key]) // Filter out any items w/ no matching ensemble index.
        .flatMap(([key, value], i) => (
          <div
            className='location-results'
            key={ensembleIndexes[key].wallTitle}
          >
            <h3 className='font-delta location-results__header'>{ensembleIndexes[key].roomTitle}, {ensembleIndexes[key].wallTitle}</h3>
            <div className='search-results-grid'>
              {value.map((object) => (
                <GridListElement
                  key={object.id}
                  object={object}
                  shouldLinksUseModal={shouldLinksUseModal}
                  modalPreviousLocation={modalPreviousLocation}
                  clearObject={clearObject}
                  isSearchResult={true}
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
          isSearchResult={isSearchResult}
        />
      ));

    // If this is a 'View More' Grid, truncate results.
    // This will always be false if location filter is applied.
    const masonryElements = (hasMoreResults  && !isLocationResult)
      ? uncutMasonryElements.slice(0, this.state.truncateThreshold)
      : uncutMasonryElements;

    // Get type of display, if this is the landing page and a search has been submitted, return formatted results.
    // TODO => This should just return wrapper element, but returning MasonryGrid causes MasonryGrid to only have a single column.
    const displayGrid = (isSearchResult || isLocationResult)
      ? (
      <SearchResultsGrid isLocationResult={isLocationResult}>
        {masonryElements}
      </SearchResultsGrid>
      ) : (
        <MasonryGrid>
          {masonryElements}
        </MasonryGrid>
      );
    
    // Body is only rendered if searching is falsy.
    const body = (masonryElements && masonryElements.length)
      ? (<div>
        <div className='component-art-object-grid-results'>
          {displayGrid}
          {Boolean(
            hasMoreResults
              && uncutMasonryElements.length !== masonryElements.length
              && !isLocationResult
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
        <CollectionFiltersApplied />
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
  hasLocation: Boolean(state.filters.advancedFilters.Location && Object.keys(state.filters.advancedFilters.Location).length) });
const mapDispatchToProps = (dispatch) => bindActionCreators(Object.assign({}, { clearObject }), dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ArtObjectGrid);
