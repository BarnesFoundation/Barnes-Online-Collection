import React, { Component } from 'react';
import './index.css';
import {ENSEMBLE, ENSEMBLE_IMAGE_URL} from '../../../ensembleIndex';
import ArtObjectGrid from '../../../components/ArtObjectGrid/ArtObjectGrid';

const getRoomImageAlt = (index) => {
  let roomImageAlt = 'Barnes Ensemble';
  const i = parseInt(index, 10);

  if (i) {
    const roomTitle = ENSEMBLE[i].roomTitle;
    const wallTitle = ENSEMBLE[i].wallTitle;
    roomImageAlt += ' ' + roomTitle;

    if (wallTitle) {
      roomImageAlt += ' ' + wallTitle;
    }
  }

  return roomImageAlt;
}

class PanelEnsemble extends Component {
  render() {
    const ensembleIndex = this.props.ensembleIndex;

    if (!ensembleIndex) {
      return null;
    }

    return (
      <div className="art-object-page__panel-ensemble">
        <div className="art-object__header m-block m-block--shallow">
          <div className="">
            <img className="art-object__image-page-centered" src={ENSEMBLE_IMAGE_URL(ensembleIndex)} alt={getRoomImageAlt(ensembleIndex)}/>
          </div>
          <div>
            <h2 className="h2">{ENSEMBLE[ensembleIndex].roomTitle}</h2>
            <h3 className="h3">{ENSEMBLE[ensembleIndex].wallTitle}</h3>
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
