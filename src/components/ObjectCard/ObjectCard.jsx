import React, { Component } from "react";
import classnames from "classnames";
import { getObjectMetaDataHtml } from "../ArtObjectPageComponents/PanelVisuallyRelated";
import "./objectCard.css";

export class ObjectCard extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.state = {
      descriptionVisible: false,
      metaDataVisible: true,
    };
  }

  handleClick(event) {
    event.preventDefault();

    if (this.props.object.shortDescription) {
      const showDescription = !this.state.descriptionVisible;
      let showMetaData = true;

      if (
        this.overlayText.getBoundingClientRect().height > this.image.height &&
        showDescription
      ) {
        // hide the meta text when the description will overlap it
        showMetaData = false;
      }

      this.setState({
        descriptionVisible: showDescription,
        metaDataVisible: showMetaData,
      });
    }
  }

  render() {
    const { object } = this.props;
    return (
      <div
        className={classnames("object-card", {
          description: this.state.descriptionVisible,
        })}
        onClick={this.handleClick}
      >
        <div className="object-card__content">
          <img
            className="object-card__content-image"
            src={object.imageUrlLarge}
            alt={object.title}
            ref={(image) => {
              this.image = image;
            }}
          />
          <div
            className={classnames("object-card__content-info", {
              invisible: !this.state.metaDataVisible,
            })}
          >
            {getObjectMetaDataHtml(object)}
          </div>
        </div>
        {object.shortDescription && (
          <div className="object-card__overlay">
            <div className="object-card__overlay-background">
              <div
                className="object-card__overlay-text"
                dangerouslySetInnerHTML={{ __html: object.shortDescription }}
                ref={(overlayText) => {
                  this.overlayText = overlayText;
                }}
              ></div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
