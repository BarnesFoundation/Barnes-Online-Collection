import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as ObjectActions from '../../actions/object';
import * as ModalActions from '../../actions/modal';
import * as FilterSetsActions from '../../actions/filterSets';
import { getArtObjectUrlFromId } from '../../helpers';
import ArtObject from '../ArtObject/ArtObject';
import SpinnerLoader from './SpinnerLoader';
import MasonryGrid from '../MasonryGrid';
import CollectionFiltersApplied from '../CollectionFilters/CollectionFiltersApplied';
import './artObjectGrid.css';

/** View more button component. */
const ViewMoreButton = ({ onClick }) => (
  <div className="view-more-button m-block m-block--no-border m-block--flush-bottom">
    <button
      className="btn"
      onClick={({ target }) => {
        onClick(); // Perform onClick prop.
        target.blur(); // Unfocus to remove styling.
      }}
    >
      View More
    </button>
  </div>
);

/** Masonry grid element. */
const GridListElement = ({
  object,
  shouldLinksUseModal,
  modalPreviousLocation,
  clearObject
}) => (
  <li className="masonry-grid-element">
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
      className="grid-list-el"
    >
      <ArtObject
        key={object.id}
        title={object.title}
        people={object.people}
        medium={object.medium}
        imageUrlSmall={object.imageUrlSmall}
      />
    </Link>
  </li>
);

/**
 * Class to manage converting raw object[] data into a masonry grid.
 */
class ArtObjectGrid extends Component {
  constructor(props) {
    super(props);

    // For "View More" results.
    this.state = {
      truncateThreshold: 20,
    };
  };

  incrementTruncateThreshold = () => {
    const { truncateThreshold } = this.state;
    this.setState({ ...this.state, truncateThreshold: truncateThreshold + 20 });
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
      clearObject
    } = this.props;

    // Searching is rendered on default, on false body will render.
    const searching = isSearchPending && <SpinnerLoader />;

    // Convert object[] to an array of ArtObjects wrapped in Links.
    const uncutMasonryElements = liveObjects.map((object) => (
      <GridListElement
        key={object.id}
        object={object}
        shouldLinksUseModal={shouldLinksUseModal}
        modalPreviousLocation={modalPreviousLocation}
        clearObject={clearObject}
      />
    ));

    // If this is a "View More" Grid, truncate results.
    const masonryElements = hasMoreResults ? uncutMasonryElements.slice(0, this.state.truncateThreshold) : uncutMasonryElements;
    
    // Body is only rendered if searching is falsy.
    const body = (masonryElements && masonryElements.length)
      ? (<div>
        <div className="component-art-object-grid-results">
          <MasonryGrid masonryElements={masonryElements} />
          {(hasMoreResults && uncutMasonryElements.length !== masonryElements.length) && <ViewMoreButton onClick={this.incrementTruncateThreshold}/>}
        </div>
      </div>)
      : (<div className="m-block no-results">
        <img className="no-results-image" width={140} src="/images/sad-face.svg" alt="no results icon" />
        <div className="no-results-message">
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

const mapStateToProps = state => ({ object: state.object });
const mapDispatchToProps = (dispatch) => (
  bindActionCreators(
    Object.assign({},
      ObjectActions,
      ModalActions,
      FilterSetsActions
    ), dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(ArtObjectGrid);
