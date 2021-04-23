import React, { Component } from "react";
import classnames from "classnames";
import { formatTourData } from "../TourPage/tourPageHelper";
import { StickyListSection } from "../StickyListSection/StickyListSection";
import "./stickyList.css";

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
