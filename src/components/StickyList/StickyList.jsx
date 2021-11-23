import React, { Component } from "react";
import classnames from "classnames";
import { StickyListSection } from "../StickyListSection/StickyListSection";
import "./stickyList.css";

export default class StickyList extends Component {
  render() {
    const {
      title,
      subtitle,
      heroImageSrc,
      description,
      sections
    } = this.props;

    return (
      <div className="sticky-list">
        <div className="sticky-list__hero">
          <img className="sticky-list__hero__image" src={heroImageSrc} />
          <div className="sticky-list__hero__text">
            <h2 className="sticky-list__hero__text-title">{title}</h2>
            {subtitle && subtitle.length && (
              <h3 className="sticky-list__hero__text-subtitle">{subtitle}</h3>
            )}
          </div>
        </div>
        <div
          className={classnames("sticky-list__description", {
            hidden: !description.length,
          })}
          dangerouslySetInnerHTML={{ __html: description }}
        ></div>

        <p className="sticky-list__mobile">
          <i>This interactive guide is best viewed on a mobile device.</i>
        </p>

        {sections.map((section) => (
          <StickyListSection
            header={section.header}
            key={section.header}
            content={section.content}
          />
        ))}
      </div>
    );
  }
}
