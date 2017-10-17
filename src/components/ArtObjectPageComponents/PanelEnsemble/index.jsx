import React, { Component } from 'react';
import './index.css';
import {ENSEMBLE, ENSEMBLE_IMAGE_URL} from '../../../ensembleIndex';
import ArtObjectGrid from '../../../components/ArtObjectGrid/ArtObjectGrid';

const getRoomAndTitleText = (ensembleIndex) => {
  const wallTitle = ENSEMBLE[ensembleIndex].wallTitle;
  const wallTitleStr = wallTitle ? `, ${wallTitle}` : '';

  return `${ENSEMBLE[ensembleIndex].roomTitle}${wallTitleStr}`;
}

class PanelEnsemble extends Component {
  render() {
    const ensembleIndex = this.props.ensembleIndex;

    // don't render anything if there is no ensembleIndex.
    if (!ensembleIndex) {
      return null;
    }

    const roomAndTitleText = getRoomAndTitleText(ensembleIndex);

    return (
      <div className="art-object-page__panel-ensemble">
        <div className="art-object__header m-block m-block--shallow">
          <div className="">
            <img className="art-object__image-page-centered" src={ENSEMBLE_IMAGE_URL(ensembleIndex)} alt={roomAndTitleText}/>
          </div>
          <div>
            <h3 className="h3">
              Barnes arranged his collection in "ensembles"<br className="medium-and-up" /> to bring out visual relationships.
            </h3>
            <h2 className="h2">{`On view: ${roomAndTitleText}`}</h2>
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
