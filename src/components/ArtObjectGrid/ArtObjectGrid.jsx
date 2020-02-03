import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as ObjectActions from '../../actions/object';
import * as ModalActions from '../../actions/modal';
import { getArtObjectUrlFromId } from '../../helpers';
import ArtObject from '../ArtObject/ArtObject';
import SpinnerLoader from './SpinnerLoader';
import MasonryGrid from '../MasonryGrid';

import './artObjectGrid.css';

const ViewMoreButton = ({ onClick }) => (
  <div className="view-more-button m-block m-block--no-border m-block--flush-bottom">
    <button
      className="btn"
      onClick={onClick}
    >
      View More
    </button>
  </div>
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

  /**
   * Utility method to get single item for masonry grid.
   * @param {object} - raw object to be converted to JSX.
   * @returns {JSX.Element} - Single ArtObject link to be placed into masonry grid.
   */
  getGridListElement = (object) => (
    <Link
      to={{
        pathname: getArtObjectUrlFromId(object.id, object.title),
        state: {
          isModal: this.props.shouldLinksUseModal || !!this.props.modalPreviousLocation,
          modalPreviousLocation: this.props.modalPreviousLocation
        },
      }}
      onClick={() => {
        // Clear the object right away to avoid a FOUC while the new object loads.
        if (this.props.shouldLinksUseModal) this.props.clearObject();
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
  );

  /**
   * Convert object[] to an array of ArtObjects wrapped in Links.
   * @param {object[]} objects - raw objects data from redux store.
   * @returns {JSX.Element[]} - Array of react elements to put inside of Masonry component.
   */
  getMasonryElements(objects) {
    return objects.map((object) => (
      (<li key={object.id} className="masonry-grid-element">
          {this.getGridListElement(object)}
      </li>)
    ));
  };

  render() {
    // Destructure props.
    const { isSearchPending, hasMoreResults, gridStyle, isFilterActive } = this.props;

    // Searching is rendered on default, on false body will render.
    const searching = isSearchPending && <SpinnerLoader />;

    // If this is a "View More" Grid, truncate results.
    const uncutMasonryElements = this.getMasonryElements(this.props.liveObjects);
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

    // If filters are active, apply 50% opacity on search results.
    let isBackgroundActiveClasses = 'component-art-object-grid__shaded-background';
    if (isFilterActive) isBackgroundActiveClasses = `${isBackgroundActiveClasses} component-art-object-grid__shaded-background--active`

    return (
      <div className='component-art-object-grid__wrapper'>
        <div className={isBackgroundActiveClasses}></div>
        <div className="container m-block m-block--shallow m-block--no-border m-block--flush-top">
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
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    object: state.object,
    isFilterActive: Boolean(state.filterSets.visibleFilterSet),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({},
    ObjectActions,
    ModalActions,
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ArtObjectGrid);
