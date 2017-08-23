import React, { Component } from 'react';
import './index.css';
import * as Constants from '../../../constants';

class PanelEnsemble extends Component {
  constructor(props) {
    super(props);
  }

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
        <div className="art-object__more-info m-block m-block--shallow">
          <div className="container-inner-narrow">
          ...
          </div>
        </div>
      </div>
    );
  }
}

export default PanelEnsemble;
