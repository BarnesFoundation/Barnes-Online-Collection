import React, { Component } from 'react';
import './index.css';
import * as Constants from '../../../constants';
import ArtObjectGrid from '../../../components/ArtObjectGrid/ArtObjectGrid';

class PanelEnsemble extends Component {
  render() {
    return (
      <div className="art-object-page__panel-ensemble">
        <div className="art-object__header m-block m-block--shallow">
          <div className="">
            <img className="art-object__image-page-centered" src="/images/ensemble-room-image.jpg" alt={Constants.ENSEMBLE_ROOM_IMAGE_ALT}/>
          </div>
          <div>
            <h2 className="h2">{Constants.ENSEMBLE_ROOM_TITLE}</h2>
            <h3 className="h3">{Constants.ENSEMBLE_ROOM_SUB_TITLE}</h3>
          </div>
        </div>
        <div className="m-block m-block--shallow">
          <ArtObjectGrid gridStyle="full-size" pageType="ensemble"/>
        </div>
      </div>
    );
  }
}

export default PanelEnsemble;
