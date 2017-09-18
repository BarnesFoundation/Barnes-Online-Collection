import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as ObjectsActions from '../../actions/objects';
import * as ObjectActions from '../../actions/object';
import { getArtObjectUrlFromId } from '../../helpers';
import ArtObject from '../ArtObject/ArtObject';
import ViewMoreButton from './ViewMoreButton';
import MasonryGrid from '../MasonryGrid';
import './artObjectGrid.css';

class ArtObjectGrid extends Component {
  componentDidMount() {
    if (this.props.objects.length === 0) {
      switch (this.props.pageType) {
        case 'visually-related':
          if (this.props.object) {
            this.props.getRelatedObjects(50, this.props.object.id);
          }
          break;
        case 'ensemble':
          if (this.props.object && this.props.object.ensembleIndex) {
            this.props.getEnsembleObjects(this.props.object.ensembleIndex);
          }
          break;
        case 'landing':
        default:
            this.props.getAllObjects();
          break;
      }
    }
  }

  componentWillUpdate(nextProps) {
    if (this.props.object !== nextProps.object) {
      switch(nextProps.pageType) {
        case 'visually-related':
          this.props.getRelatedObjects(50, nextProps.object.id);
          break;
        case 'ensemble':
          if (nextProps.object && nextProps.object.ensembleIndex) {
            this.props.getEnsembleObjects(nextProps.object.ensembleIndex);
          }
          break;
        case 'landing':
        default:
          this.props.getAllObjects();
          break;
      }
    }
  }

  getMasonryElements() {
    return this.props.objects.map(function(object) {
      return (
        <li key={object.id} className="masonry-grid-element">
          <Link to={getArtObjectUrlFromId(object.id)}>
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
    });
  };

  getClasses() {
    let classes = 'component-art-object-grid';
    if (this.props.objects.length > 0) {
      classes += ' fade-in';
    }
    return classes;
  }

  render() {
    const masonryElements = this.getMasonryElements();
    return (
      <div
        className={this.getClasses()}
        data-grid-style={this.props.gridStyle}
      >
        {masonryElements.length &&
          <MasonryGrid masonryElements={masonryElements} />
        }
        <ViewMoreButton />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    objects: state.objects,
    object: state.object
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({},
    ObjectsActions,
    ObjectActions,
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ArtObjectGrid);
