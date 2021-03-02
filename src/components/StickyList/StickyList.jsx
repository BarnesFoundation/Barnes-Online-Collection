import React, { Component } from "react";
import classnames from "classnames";
import { getObjectMetaDataHtml } from "../ArtObjectPageComponents/PanelVisuallyRelated";
import { formatTourData } from "../TourPage/tourPageHelper";
import { parseObject } from "../../objectDataUtils";
import "./stickyList.css";

class ObjectCard extends Component {
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
        className={classnames("sticky-list__section__content__image-card", {
          description: this.state.descriptionVisible,
        })}
        onClick={this.handleClick}
      >
        <div className="art-object__image-container">
          <img
            className="art-object__image"
            src={object.imageUrlLarge}
            alt={object.title}
            ref={(image) => {
              this.image = image;
            }}
          />
          <div
            className={classnames("art-object__image-information", {
              invisible: !this.state.metaDataVisible,
            })}
          >
            {getObjectMetaDataHtml(object)}
          </div>
        </div>
        {object.shortDescription && (
          <div className="overlay">
            <div className="overlay-background">
              <div
                className="overlay-text"
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

class StickyListSection extends Component {
  constructor(props) {
    super(props);

    this.handleScroll = this.handleScroll.bind(this);
    this.state = { isFixed: false, isAbsolute: true };
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  handleScroll(event) {
    let isFixed = this.state.isFixed;
    const sectionBounds = this.section.getBoundingClientRect();

    if (sectionBounds.top <= 0 && sectionBounds.bottom > 0) {
      // when the section is visible, header is fixed at window top
      isFixed = true;
    } else {
      // when the section is not visible, header is absolutely positioned at section top
      isFixed = false;
    }

    this.setState({ isFixed: isFixed, isAbsolute: !isFixed });
  }

  render() {
    return (
      <div
        className="sticky-list__section"
        ref={(section) => {
          this.section = section;
        }}
      >
        <div
          className={classnames("sticky-list__section__header", {
            fixed: this.state.isFixed,
            absolute: this.state.isAbsolute,
          })}
          ref={(header) => {
            this.header = header;
          }}
        >
          <div className="sticky-list__section__header-text">
            {this.props.header}
          </div>
        </div>
        <div className="sticky-list__section__content">
          {this.props.section.content.map((obj) => {
            return <ObjectCard object={parseObject(obj)} key={obj.id} />;
          })}
        </div>
      </div>
    );
  }
}

export default class StickyList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      title,
      heroImageSrc,
      description,
      objects,
      sectionOrder,
    } = this.props;

    return (
      <div className="sticky-list">
        <div className="sticky-list__hero">
          <img className="sticky-list__hero__image" src={heroImageSrc} />
          <div className="sticky-list__hero__title">
            <h2>{title}</h2>
          </div>
        </div>
        <p
          className={classnames("sticky-list__description", {
            hidden: !description.length,
          })}
          dangerouslySetInnerHTML={{ __html: description }}
        ></p>

        <p className="sticky-list__mobile">
          <i>This interactive guide is best viewed on a mobile device.</i>
        </p>

        {formatTourData(sectionOrder, objects).map((section) => (
          <StickyListSection
            header={section.header}
            key={section.header}
            section={section}
          />
        ))}
      </div>
    );
  }
}
