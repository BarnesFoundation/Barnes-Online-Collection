import React, { Component, useCallback, useLayoutEffect, useRef } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import ArtObject from "../ArtObject/ArtObject";
import SpinnerLoader from "./SpinnerLoader";
import CollectionFiltersApplied from "../CollectionFilters/CollectionFiltersApplied";
import { clearObject } from "../../actions/object";
import { getNextObjects } from "../../actions/objects";
import {
  NETX_ENABLED,
  getArtObjectUrlFromId,
  getImageURLFromRendition,
} from "../../helpers";
import ensembleIndexes from "../../ensembleIndexes";
import { ART_OBJECT_GRID_INCREMENT } from "../../constants";
import { DROPDOWN_TERMS } from "../SearchInput/Dropdowns/Dropdowns";
import "./searchResultsGrid.css";
import "./artObjectGrid.css";

/** View more button component. */
const ViewMoreButton = ({ onClick }) => (
  <div className="view-more-button m-block m-block--no-border m-block--flush-bottom">
    <button
      className="btn btn--view-more"
      onClick={({ target }) => {
        onClick(); // Perform onClick prop.
        target.blur(); // Unfocus to remove styling.
      }}
    >
      View More
    </button>
  </div>
);

/**
 * CSS-grid masonry — replaces react-masonry-component. Each tile lives in a real CSS grid
 * (`grid-auto-rows` + a per-item `grid-row-end: span N`); the span is computed from the tile's
 * measured height in useLayoutEffect, BEFORE paint. Because the grid <img> carries intrinsic
 * width/height (V2 image dims), the tile's height is already correct before the image bytes load, so
 * the spans are right on the first frame → zero CLS, while keeping the packed masonry look and the
 * hover-overlay captions. Reflows on container resize and when any dimensionless image finishes.
 * @see artObjectGrid.scss `.css-masonry` (defines --masonry-row / --masonry-gap read below).
 */
const CssMasonry = ({ children }) => {
  const ref = useRef(null);
  const lastWidth = useRef(-1);

  const relayout = useCallback(() => {
    const grid = ref.current;
    if (!grid) return;
    const cs = getComputedStyle(grid);
    const row = parseFloat(cs.getPropertyValue("--masonry-row")) || 2;
    const gap = parseFloat(cs.getPropertyValue("--masonry-gap")) || 4;
    for (let i = 0; i < grid.children.length; i++) {
      const el = grid.children[i];
      const content = el.firstElementChild || el; // natural (un-constrained) tile height
      const h = content.getBoundingClientRect().height;
      el.style.gridRowEnd = "span " + Math.max(1, Math.ceil((h + gap) / row));
    }
  }, []);

  useLayoutEffect(() => {
    const grid = ref.current;
    lastWidth.current = grid ? grid.getBoundingClientRect().width : -1;
    relayout();
    // Setting row-spans changes the grid's HEIGHT, which would re-fire a naive ResizeObserver in a
    // loop. Only the column WIDTH affects tile heights, so reflow only when the width actually changes.
    const onResize = () => {
      const w = grid ? grid.getBoundingClientRect().width : -1;
      if (w !== lastWidth.current) {
        lastWidth.current = w;
        relayout();
      }
    };
    const ro =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(onResize) : null;
    if (ro && grid) ro.observe(grid);
    window.addEventListener("resize", onResize);
    // dimensionless images (no V2 dims) reserve no box up front — recompute once each loads.
    const imgs = grid ? Array.from(grid.querySelectorAll("img")) : [];
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener("load", relayout);
    });
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener("resize", onResize);
      imgs.forEach((img) => img.removeEventListener("load", relayout));
    };
  });

  return (
    <ul ref={ref} className="component-masonry-grid css-masonry">
      {children}
    </ul>
  );
};

/**
 * Search results grid component.
 * @see searchResultsGrid.scss for styling.
 * */
const SearchResultsGrid = ({ children, isRoomResult }) => (
  <div className={!isRoomResult ? "search-results-grid" : null}>{children}</div>
);

/** Masonry grid element. */
const GridListElement = ({
  object,
  shouldLinksUseModal,
  modalPreviousLocation,
  clearObject,
  isFilterResult,
  isSearchResult,
}) => {
  let gridListElementClassNames = "masonry-grid-element";
  if (isFilterResult)
    gridListElementClassNames = `${gridListElementClassNames} search-results-grid__element`;
  const renditions =
    NETX_ENABLED && object.renditions ? object.renditions : null;
  const primaryRendition = renditions?.length ? renditions[0] : null;

  const artworkRenditionThumbnailUrl = primaryRendition
    ? getImageURLFromRendition(primaryRendition, "Thumbnail")
    : null;
  const artworkRenditionPreviewUrl = primaryRendition
    ? getImageURLFromRendition(primaryRendition, "Preview")
    : null;

  return (
    <li className={gridListElementClassNames}>
      <Link
        to={{
          pathname: getArtObjectUrlFromId(object.id, object.title),
          state: {
            isModal: shouldLinksUseModal || Boolean(modalPreviousLocation),
            modalPreviousLocation: modalPreviousLocation,
          },
        }}
        onClick={() => {
          // Clear the object right away to avoid a FOUC while the new object loads.
          clearObject();

          if (!shouldLinksUseModal) {
            window.scrollTo(0, 0);
          }
        }}
        className="grid-list-el"
      >
        <ArtObject
          key={object.id}
          title={object.title}
          people={object.people}
          medium={object.medium}
          imageUrlSmall={artworkRenditionThumbnailUrl || object.imageUrlSmall}
          imageUrlLarge={artworkRenditionPreviewUrl || object.imageUrlLarge}
          // Intrinsic dims (V2 enrichImageDims) → <img width/height> so CssMasonry can size each
          // tile's row-span before the image loads (zero CLS).
          imageWidth={object.imageWidth}
          imageHeight={object.imageHeight}
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
      truncateThreshold: ART_OBJECT_GRID_INCREMENT,
    };
  }

  /**
   * Set reset truncate if prop exists.
   */
  componentDidMount() {
    const { setResetTruncateThreshold } = this.props;

    if (setResetTruncateThreshold) {
      setResetTruncateThreshold(() =>
        this.setState({ truncateThreshold: ART_OBJECT_GRID_INCREMENT })
      );
    }
  }

  /**
   * Increase number of art objects shown in grid.
   */
  incrementTruncateThreshold = () => {
    const { getNextObjects } = this.props;
    const { truncateThreshold } = this.state;

    getNextObjects(truncateThreshold + ART_OBJECT_GRID_INCREMENT);
    this.setState({
      ...this.state,
      truncateThreshold: truncateThreshold + ART_OBJECT_GRID_INCREMENT,
    });
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
      hasFilter,
      hasRoom,
    } = this.props;

    // Searching is rendered on default, on false body will render.
    const searching = isSearchPending && <SpinnerLoader />;
    const isSearchResult = Boolean(shouldLinksUseModal && hasSearch);
    const isFilterResult = Boolean(shouldLinksUseModal && hasFilter);
    const isRoomResult = Boolean(shouldLinksUseModal && hasRoom);

    // Convert object[] to an array of ArtObjects wrapped in Links.
    const uncutMasonryElements = isRoomResult
      ? Object.entries(
          liveObjects.reduce(
            (acc, object) => ({
              // Put liveObjects into bucket according to ensemble index.
              ...acc,
              [object.ensembleIndex]: acc[object.ensembleIndex]
                ? [...acc[object.ensembleIndex], object]
                : [object],
            }),
            {}
          )
        )
          .sort(([keyA], [keyB]) => keyA - keyB) // Reverse sort keys by number to guarantee render in order.
          .filter(([key]) => ensembleIndexes[key]) // Filter out any items w/ no matching ensemble index.
          .map(([key, value]) => (
            <div
              className="location-results"
              key={`${ensembleIndexes[key].roomTitle}, ${ensembleIndexes[key].wallTitle}`}
            >
              <h3 className="font-delta location-results__header">
                {ensembleIndexes[key].roomTitle}
                {ensembleIndexes[key].wallTitle
                  ? `, ${ensembleIndexes[key].wallTitle}`
                  : ""}
              </h3>
              <div className="search-results-grid">
                {value.map((object) => (
                  <GridListElement
                    key={object.id}
                    object={object}
                    shouldLinksUseModal={shouldLinksUseModal}
                    modalPreviousLocation={modalPreviousLocation}
                    clearObject={clearObject}
                    isFilterResult={true}
                    isSearchResult={isSearchResult}
                  />
                ))}
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
    const masonryElements =
      hasMoreResults && !isRoomResult
        ? uncutMasonryElements.slice(0, this.state.truncateThreshold)
        : uncutMasonryElements;

    // Get type of display: filter/room results use the aligned CSS SearchResultsGrid; everything
    // else (landing-featured + keyword search) uses the packed CssMasonry.
    const displayGrid =
      isFilterResult || isRoomResult ? (
        <SearchResultsGrid isRoomResult={isRoomResult}>
          {masonryElements}
        </SearchResultsGrid>
      ) : (
        <CssMasonry>{masonryElements}</CssMasonry>
      );

    let bodyClass = "component-art-object-grid-results";
    if (shouldLinksUseModal)
      bodyClass = `${bodyClass} component-art-object-grid-results--landing-page`;

    // Body is only rendered if searching is falsy.
    const body =
      masonryElements && masonryElements.length ? (
        <div>
          <div className={bodyClass}>
            {displayGrid}
            {Boolean(
              hasMoreResults &&
                uncutMasonryElements.length !== masonryElements.length &&
                !isRoomResult
            ) && <ViewMoreButton onClick={this.incrementTruncateThreshold} />}
          </div>
        </div>
      ) : (
        <div className="m-block no-results">
          <img
            className="no-results-image"
            width={140}
            src="/images/sad-face.svg"
            alt="no results icon"
          />
          <div className="no-results-message">No results for this search.</div>
        </div>
      );

    return (
      <div className="m-block m-block--shallow m-block--no-border m-block--flush-top component-art-object-grid__wrapper">
        {shouldLinksUseModal && <CollectionFiltersApplied />}
        <div
          className={`
            component-art-object-grid
            ${masonryElements.length ? "has-elements" : ""}
            ${isSearchPending ? "is-pending" : ""}
          `}
          data-grid-style={gridStyle}
        >
          {searching || body}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  object: state.object,
  hasSearch: Boolean(state.filters.search),

  // If this is a search via filter.
  hasFilter: Boolean(
    state.filters.ordered.length ||
      Object.values(state.filters.advancedFilters).some(
        (advancedFilter) => Object.keys(advancedFilter).length
      )
  ),

  // If this is specifically a location search.
  hasRoom: Boolean(
    state.filters.advancedFilters[DROPDOWN_TERMS.ROOM] &&
      Object.keys(state.filters.advancedFilters[DROPDOWN_TERMS.ROOM]).length
  ),
});
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    Object.assign({}, { clearObject, getNextObjects }),
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(ArtObjectGrid);
