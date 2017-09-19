import React, { Component } from 'react';
import './index.css';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ObjectsActions from '../../../actions/objects';
import ArtObjectGrid from '../../../components/ArtObjectGrid/ArtObjectGrid';

import Slider from '../../../components/Slider/Slider.jsx';

const getDisplayDateAndMedium = (displayDate, medium) => {
  const connector = displayDate && medium ? '—' : '';

  return (displayDate || '') + connector + (medium || '');
};

class PanelVisuallyRelated extends Component {
  constructor(props) {
    super(props);
    this.getRelatedObjects = this.getRelatedObjects.bind(this);
  }

  getRelatedObjects(value) {
    this.props.getRelatedObjects(this.props.object.id, value);
  }

  render() {
    const object = this.props.object;

    return (
      <div className="m-block m-block--shallow">
        <div className="m-block__columns">
          <div className="m-block__column m-block__column--page-col">
            <div className="art-object__image-container">
              <img className="art-object__image" src={object.imageUrlLarge} alt={object.title}/>
              <div className="art-object__image-information">
                <p>{getDisplayDateAndMedium(object.displayDate, object.medium)}</p>
              </div>

              {/* tags go here */}
              {this.props.theSearchTagsGoHere &&
                <div className="m-block m-block--no-border m-block--shallow m-block--flush-bottom art-object__search-tags">
                </div>
              }
            </div>
          </div>
          <div className="m-block__column m-block__column--page-col">
            <Slider
              labelLeft='More similar'
              labelRight='More surprising'
              handleChange={this.getRelatedObjects}
            />
            <ArtObjectGrid pageType="visually-related"/>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    object: state.object,
    objects: state.objects
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({},
    ObjectsActions,
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PanelVisuallyRelated);
