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

class ArtObjectGrid extends Component {
  constructor(props) {
    super(props);

    this.getGridListElement = this.getGridListElement.bind(this);
  }

  getGridListElement(object) {
    const clickHandler = function(e) {
      if (this.props.shouldLinksUseModal) {
        // clear the object right away to avoid a FOUC while the new object loads
        this.props.clearObject();
      }
    }.bind(this);

    return (
      <Link
        to={{
          pathname: getArtObjectUrlFromId(object.id),
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

  getMasonryElements(objects) {
    return objects.map(function(object) {
      return (
        <li key={object.id} className="masonry-grid-element">
          {this.getGridListElement(object)}
        </li>
      );
    }.bind(this));
  };

  renderEmptySet_() {
    return (
      this.props.isSearchPending ?
        <SpinnerLoader />
      :
        <div className="m-block no-results">
          <img className="no-results-image" width={140} src="/images/sad-face.svg" alt="no results icon" />
          <div className="no-results-message">
            No results for this search.
          </div>
        </div>
    )
  }

  renderFullSet_(masonryElements) {
    return (
      <div>
        <div className="component-art-object-grid-results">
          <MasonryGrid masonryElements={masonryElements} />
          { this.props.hasMoreResults &&
            <ViewMoreButton />
          }
        </div>
        <div className="loading-overlay">
          <SpinnerLoader />
        </div>
      </div>
    )
  }

  render() {
    const liveObjects = this.props.liveObjects;
    const masonryElements = this.getMasonryElements(liveObjects);
    const hasElements = masonryElements.length > 0;

    const hasElementsClass = hasElements ? 'has-elements' : '';
    const isPendingClass = this.props.isSearchPending ? 'is-pending' : '';

    return (
      <div
        className={`component-art-object-grid ${hasElementsClass} ${isPendingClass}`}
        data-grid-style={this.props.gridStyle}
      >
        {
          hasElements ? this.renderFullSet_(masonryElements) : this.renderEmptySet_()
        }
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
