import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as ObjectActions from '../../actions/object';
import * as ModalActions from '../../actions/modal';
import { getArtObjectUrlFromId } from '../../helpers';
import ArtObject from '../ArtObject/ArtObject';
import ViewMoreButton from './ViewMoreButton';
import SpinnerLoader from './SpinnerLoader';
import MasonryGrid from '../MasonryGrid';

import './artObjectGrid.css';

/**
 * Class to manage converting raw object[] data into a masonry grid.
 */
class ArtObjectGrid extends Component {
  constructor(props) {
    super(props);
  }

  /**
   * Utility method to get single item for masonry grid.
   * @param {object} - raw object to be converted to JSX.
   * @returns {JSX.Element} - Single ArtObject link to be placed into masonry grid.
   */
  getGridListElement = (object) => {
    const clickHandler = () => {
      // Clear the object right away to avoid a FOUC while the new object loads.
      if (this.props.shouldLinksUseModal) this.props.clearObject();
    };

    return (
      <Link
        to={{
          pathname: getArtObjectUrlFromId(object.id, object.title),
          state: {
            isModal: this.props.shouldLinksUseModal || !!this.props.modalPreviousLocation,
            modalPreviousLocation: this.props.modalPreviousLocation
          },
        }}
        onClick={clickHandler}
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
  }

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
    const masonryElements = this.getMasonryElements(this.props.liveObjects);
    
    // Searching is rendered on default, on false body will render.
    const searching = this.props.isSearchPending && <SpinnerLoader />;
    
    // Body is only rendered if searching is falsy.
    const body = (masonryElements && masonryElements.length)
      ? (<div>
        <div className="component-art-object-grid-results">
          <MasonryGrid masonryElements={masonryElements} />
          {/* {this.props.hasMoreResults && <ViewMoreButton />} */}
        </div>
      </div>)
      : (<div className="m-block no-results">
        <img className="no-results-image" width={140} src="/images/sad-face.svg" alt="no results icon" />
        <div className="no-results-message">
          No results for this search.
        </div>
      </div>);

    return (
      <div
        className={`
          component-art-object-grid
          ${masonryElements.length ? 'has-elements' : ''}
          ${this.props.isSearchPending ? 'is-pending' : ''}
        `}
        data-grid-style={this.props.gridStyle}
      >
        {searching || body}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    object: state.object,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({},
    ObjectActions,
    ModalActions,
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ArtObjectGrid);
