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
  }

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

  getMasonryElements(objects) {
    return objects.map((object) => (
      (<li key={object.id} className="masonry-grid-element">
          {this.getGridListElement(object)}
      </li>)
    ));
  };

  render() {
    const liveObjects = this.props.liveObjects;
    const masonryElements = this.getMasonryElements(liveObjects);
    const searching = this.props.isSearchPending && <SpinnerLoader />;

    const body = (masonryElements && masonryElements.length)
        ? (<div>
          <div className="component-art-object-grid-results">
            <MasonryGrid masonryElements={masonryElements} />
            {this.props.hasMoreResults && <ViewMoreButton />}
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
          ${masonryElements.length
            ? 'has-elements' : ''}
          ${this.props.isSearchPending
            ? 'is-pending' :
            ''}`
        }
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
