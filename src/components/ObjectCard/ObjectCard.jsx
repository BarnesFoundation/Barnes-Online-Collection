import React, { Component } from "react";
import classnames from "classnames";
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

    if (this.props.object.overlayText) {
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

  imageAria(object) {
    const culture = object.culture ? `, ${object.culture}` : "";
    return `${object.title} by ${object.people}${culture}.`;
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
            src={object.imageUrlLarge || object.imageUrlOriginal}
            alt={object.title}
            aria-label={this.imageAria(object)}
            ref={(image) => {
              this.image = image;
            }}
          />
          <div
            className={classnames("object-card__content-info", {
              invisible: !this.state.metaDataVisible,
            })}
          >
            {object.contentInfo}
          </div>
        </div>
        {object.overlayText && (
          <div className="object-card__overlay">
            <div className="object-card__overlay-background">
              <div
                className="object-card__overlay-text"
                ref={(overlayText) => {
                  this.overlayText = overlayText;
                }}
              >
                {object.overlayText}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
