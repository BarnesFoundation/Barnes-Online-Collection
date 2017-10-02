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

    const headerH2Text = `On view: ${ENSEMBLE[ensembleIndex].roomTitle}, ${ENSEMBLE[ensembleIndex].wallTitle}`;

    return (
      <div className="art-object-page__panel-ensemble">
        <div className="art-object__header m-block m-block--shallow">
          <div className="">
            <img className="art-object__image-page-centered" src={ENSEMBLE_IMAGE_URL(ensembleIndex)} alt={getRoomImageAlt(ensembleIndex)}/>
          </div>
          <div>
            <h3 className="h3">
              Barnes arranged his collection in "ensembles"<br className="br-large-only" /> to bring out visual relationships.
            </h3>
            <h2 className="h2">{headerH2Text}</h2>
          </div>
        </div>
        <div className="m-block m-block--shallow m-block--flush-top m-block--no-border">
          <ArtObjectGrid gridStyle="full-size" pageType="ensemble"/>
        </div>
      </div>
    );
  }
}

export default PanelEnsemble;
