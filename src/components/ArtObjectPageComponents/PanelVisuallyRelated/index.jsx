import React, { Component } from "react";
import "./index.css";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as RelatedObjectsActions from "../../../actions/relatedObjects";
import ArtObjectGrid from "../../../components/ArtObjectGrid/ArtObjectGrid";
import Slider from "../../../components/Slider/Slider.jsx";
import FilterTagSetGeneric from "../../../components/CollectionFilters/FilterTagSetGeneric.jsx";
import { BARNES_SETTINGS } from "../../../barnesSettings";
import { SLIDER_FILTERS, LINE_FILTERS } from "../../../filterSettings";
import { getObjectCopyright } from "../../../copyrightMap";
import { ShareDialog } from "../../ShareDialog/ShareDialog";

export const getObjectMetaDataHtml = (object) => {
  const objectCopyright = getObjectCopyright(object);

  if (!object.id) {
    return null;
  }

  // Check if the artist/maker is unidentified. Generate culture line based on that
  const unidentified = object.people.toLowerCase().includes("unidentified");
  const culture = unidentified && object.culture ? `, ${object.culture}` : "";

  const metaData = (
    <p>
      <span>{`${object.people}${culture}. `}</span>
      <span>{`${object.title}, ${object.displayDate}. `}</span>
      <span>{`${object.medium}, ${object.dimensions}. `}</span>
      <span>{`Barnes Foundation ${object.invno}. `}</span>
      <span>{`${objectCopyright.copy}. `}</span>
      {object.creditLine && <span>{`${object.creditLine}. `}</span>}
    </p>
  );

  return metaData;
};

const getArtObjectFilters = (object) => {
  const getLinePills = (object) => {
    return LINE_FILTERS.composition.filter((filter) => {
      const value = object[filter.name] || 0;

      if (value < BARNES_SETTINGS.line_threshhold) {
        return false;
      }

      return true;
    });
  };

  const getColorPills = (object) => {
    if (!object.color) {
      return [];
    }

    // there's only one
    return [
      {
        color: object.color["average-closest"],
        filterType: "colors",
      },
    ];
  };

  const getSliderPills = (object) => {
    return SLIDER_FILTERS.filter((filter) => {
      // throw out zero values
      return object[filter.name];
    }).map((filter) => {
      const value = object[filter.name];
      // shift from -1<>1 to 0<>100. Round to nearest int.
      const percValue = Math.round(value * 50 + 50);

      return Object.assign({}, filter, {
        value: percValue,
      });
    });
  };

  const linePills = getLinePills(object);
  const colorPills = getColorPills(object);
  const sliderPills = getSliderPills(object);

  return [...linePills, ...colorPills, ...sliderPills];
};

class PanelVisuallyRelated extends Component {
  constructor(props) {
    super(props);
    this.getRelatedObjects = this.getRelatedObjects.bind(this);
  }

  getRelatedObjects(value) {
    this.props.getRelatedObjects(this.props.object.id, value);
  }

  getFilterTags() {
    const object = this.props.object;

    if (!object) {
      return null;
    }

    return getArtObjectFilters(object);
  }

  fetchObjects(objectId) {
    this.props.getRelatedObjects(objectId);
  }

  componentDidMount() {
    const objectId = this.props.object.id;

    if (typeof objectId !== "undefined") {
      this.fetchObjects(objectId);
    }
  }

  componentWillUpdate(nextProps) {
    if (this.props.object.id !== nextProps.object.id) {
      this.fetchObjects(nextProps.object.id);
    }
  }

  render() {
    const object = this.props.object;
    const filterTags = this.getFilterTags();
    const queryState = this.props.relatedObjectsQuery || {};
    const isSearchPending = queryState.isPending;

    const liveObjects = this.props.relatedObjects;
    const pageType = "visually-related";

    return (
      <div className="m-block m-block--shallow">
        <div className="m-block__columns m-block__columns--page-cols">
          <div className="m-block__column m-block__column--page-col">
            <div className="art-object__image-container">
              <img
                className="art-object__image"
                src={object.imageUrlLarge}
                alt={object.title}
              />
              <div className="art-object__image-information">
                {getObjectMetaDataHtml(object)}
                <div className="share share--center">
                  <ShareDialog object={object} />
                </div>
              </div>
              {filterTags && (
                <div className="art-object__search-tags">
                  <FilterTagSetGeneric filterTags={filterTags} />
                </div>
              )}
            </div>
          </div>
          <div className="m-block__column m-block__column--page-col">
            <Slider
              labelLeft="More similar"
              labelRight="More surprising"
              handleChange={this.getRelatedObjects}
              defaultValue={50}
            />
            {/* Don't allow for the view more button on visually related tab. */}
            <ArtObjectGrid
              modalPreviousLocation={this.props.modalPreviousLocation}
              isSearchPending={isSearchPending}
              liveObjects={liveObjects}
              pageType={pageType}
            />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    object: state.object,
    relatedObjects: state.relatedObjects,
    relatedObjectsQuery: state.relatedObjectsQuery,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, RelatedObjectsActions), dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PanelVisuallyRelated);
