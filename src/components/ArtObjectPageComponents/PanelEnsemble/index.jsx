import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getRoomAndTitleText,
  ENSEMBLE_IMAGE_URL,
} from "../../../ensembleIndex";
import ArtObjectGrid from "../../../components/ArtObjectGrid/ArtObjectGrid";
import * as EnsembleObjectsActions from "../../../actions/ensembleObjects";
import "./index.css";

class PanelEnsemble extends Component {
  componentDidMount() {
    const ensembleIndex = this.props.object.ensembleIndex;

    if (typeof ensembleIndex !== "undefined") {
      this.fetchObjects(ensembleIndex);
    }
  }

  componentWillUpdate(nextProps) {
    const currEnsembleIndex = this.props.object.ensembleIndex;
    const nextEnsembleIndex = nextProps.object.ensembleIndex;

    if (nextEnsembleIndex && currEnsembleIndex !== nextEnsembleIndex) {
      this.fetchObjects(nextEnsembleIndex);
    }
  }

  fetchObjects(ensembleIndex) {
    this.props.getEnsembleObjects(ensembleIndex);
  }

  render() {
    const ensembleIndex = this.props.ensembleIndex;
    const queryState = this.props.ensembleObjectsQuery || {};
    const isSearchPending = queryState.isPending;
    const liveObjects = this.props.ensembleObjects;
    const pageType = "ensemble";

    // don't render anything if there is no ensembleIndex.
    if (!ensembleIndex) {
      return null;
    }

    const roomAndTitleText = getRoomAndTitleText(ensembleIndex);

    return (
      <div className="art-object-page__panel-ensemble">
        <div className="art-object__header m-block m-block--shallow">
          <div className="">
            <img
              className="art-object__image-page-centered"
              src={ENSEMBLE_IMAGE_URL(ensembleIndex)}
              alt={roomAndTitleText}
            />
          </div>
          <div>
            <h3 className="h3">
              Dr. Barnes arranged his collection in “ensembles”
              <br className="medium-and-up" /> to bring out visual
              relationships.
            </h3>
            <h2 className="h2">{`On view: ${roomAndTitleText}`}</h2>
          </div>
        </div>
        <div className="m-block m-block--shallow m-block--flush-top m-block--no-border">
          {/* Don't allow for the view more button on ensemble tab. */}
          <ArtObjectGrid
            gridStyle="full-size"
            isSearchPending={isSearchPending}
            liveObjects={liveObjects}
            pageType={pageType}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    object: state.object,
    ensembleObjects: state.ensembleObjects,
    ensembleObjectsQuery: state.ensembleObjectsQuery,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    Object.assign({}, EnsembleObjectsActions),
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(PanelEnsemble);
