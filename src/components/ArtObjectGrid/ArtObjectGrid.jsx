import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as EnsembleObjectsActions from '../../actions/ensembleObjects';
import * as RelatedObjectsActions from '../../actions/relatedObjects';
import * as ObjectsActions from '../../actions/objects';
import * as ObjectActions from '../../actions/object';
import * as UIActions from '../../actions/ui';
import { getArtObjectUrlFromId } from '../../helpers';
import ArtObject from '../ArtObject/ArtObject';
import ViewMoreButton from './ViewMoreButton';
import MasonryGrid from '../MasonryGrid';
import { DEV_LOG } from '../../devLogging';

import './artObjectGrid.css';

const uniqBy = require('lodash/uniqBy');

class ArtObjectGrid extends Component {
  constructor(props) {
    super(props);

    this.getGridListElement = this.getGridListElement.bind(this);
  }

  componentDidMount() {
    const object = this.props.object || {};
    const objects = this.props.objects || [];
    const relatedObjects = this.props.relatedObjects || [];
    const ensembleObjects = this.props.ensembleObjects || [];

    switch (this.props.pageType) {
      case 'visually-related':
        if (object.id && !relatedObjects.length) {
          this.props.getRelatedObjects(object.id);
        }
        break;
      case 'ensemble':
        if (object.ensembleIndex && !ensembleObjects.length) {
          this.props.getEnsembleObjects(this.sanitizeEnsembleIndex(object.ensembleIndex));
        }
        break;
      case 'landing':
      default:
        if (!objects.length) {
          this.props.getAllObjects();
        }
        break;
    }
  }

  getGridListElement(object) {
    const clickHandler = function(e) {

      if (this.props.pageType === 'landing') {
        e.preventDefault();

        this.props.modalShow();
        this.props.getObject(object.id);
      }
    }.bind(this);

    return (
      <Link
        to={getArtObjectUrlFromId(object.id)}
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

  sanitizeEnsembleIndex(index) {
    return index ? index.split(',')[0] : null;
  }

  getMasonryElements(liveObjects) {
    const objects = uniqBy(liveObjects, 'id');
    const dedupedObjectLen = liveObjects.length - objects.length;

    if(dedupedObjectLen > 0) {
      DEV_LOG(`Note: ${dedupedObjectLen} objects were duplicates and removed from the masonry grid.`);
    }

    return objects.map(function(object) {
      return (
        <li key={object.id} className="masonry-grid-element">
          {this.getGridListElement(object)}
        </li>
      );
    }.bind(this));
  };

  componentWillUpdate(nextProps) {

    if (this.props.object !== nextProps.object) {
      switch(nextProps.pageType) {
        case 'visually-related':
          this.props.getRelatedObjects(nextProps.object.id);
          break;
        case 'ensemble':
          if (nextProps.object && nextProps.object.ensembleIndex) {
            this.props.getEnsembleObjects(this.sanitizeEnsembleIndex(nextProps.object.ensembleIndex));
          }
          break;
        case 'landing':
        default:
          this.props.getAllObjects();
          break;
      }
    }
  }

  render() {
    // if (this.props.object.id) {
    // }

    let liveObjects;

    switch (this.props.pageType) {
      case 'visually-related':
        liveObjects = this.props.relatedObjects || [];
        break;
      case 'ensemble':
        liveObjects = this.props.ensembleObjects || [];
        break;
      case 'landing':
      default:
        liveObjects = this.props.objects || [];
        break;
    }

    const masonryElements = this.getMasonryElements(liveObjects);
    const hasElements = masonryElements.length > 0;
    // todo - add pending for other things too
    const searchIsPending = this.props.queryResults ? this.props.queryResults.isPending : false;

    return (
      <div
        className={`component-art-object-grid ${liveObjects.length > 0 ? 'fade-in' : ''}`}
        data-grid-style={this.props.gridStyle}
      >
        { hasElements ?
          <div className="component-art-object-grid-results">
            <MasonryGrid masonryElements={masonryElements} />
            { this.props.pageType !== 'ensemble' &&
              <ViewMoreButton />
            }
          </div>
        : (
          searchIsPending ?
            <div className="spinner">
              <div className="bounce1"></div>
              <div className="bounce2"></div>
              <div className="bounce3"></div>
            </div>
          :
            <div className="m-block no-results">
              <img className="no-results-image" width={140} src="/images/sad-face.svg" alt="no results icon" />
              <div className="no-results-message">
                No results for this search.
              </div>
            </div>
          )
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ensembleObjects: state.ensembleObjects,
    relatedObjects: state.relatedObjects,
    objects: state.objects,
    object: state.object,
    queryResults: state.queryResults,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({},
    EnsembleObjectsActions,
    RelatedObjectsActions,
    ObjectsActions,
    ObjectActions,
    UIActions,
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ArtObjectGrid);
