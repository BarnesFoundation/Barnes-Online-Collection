import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
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
    if (this.props.objects.length === 0) {
      switch (this.props.pageType) {
        case 'visually-related':
          if (this.props.object) {
            this.props.getRelatedObjects(this.props.object.id);
          }
          break;
        case 'ensemble':
          if (this.props.object && this.props.object.ensembleIndex) {
            this.props.getEnsembleObjects(this.sanitizeEnsembleIndex(this.props.object.ensembleIndex));
          }
          break;
        case 'landing':
        default:
            this.props.getAllObjects();
          break;
      }
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

  getMasonryElements() {
    const objects = uniqBy(this.props.objects, 'id');
    const dedupedObjectLen = this.props.objects.length - objects.length;

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

  getClasses() {
    let classes = 'component-art-object-grid';

    if (this.props.objects.length > 0) {
      classes += ' fade-in';
    }

    return classes;
  }

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
    const masonryElements = this.getMasonryElements();
    const hasElements = masonryElements.length > 0;
    const searchIsPending = this.props.queryResults.isPending;

    return (
      <div
        className={this.getClasses()}
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
    objects: state.objects,
    object: state.object,
    queryResults: state.queryResults,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({},
    ObjectsActions,
    ObjectActions,
    UIActions,
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ArtObjectGrid);
