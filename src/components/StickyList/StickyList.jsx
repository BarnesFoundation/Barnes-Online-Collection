import React, { Component } from "react";
import classnames from "classnames";
import parse from "html-react-parser";
import { StickyListSection } from "../StickyListSection/StickyListSection";
import DropDownSelector from "../DropDownSelector/DropDownSelector";
import "./stickyList.css";

export default class StickyList extends Component {
  render() {
    const {
      title,
      subtitle,
      heroImageSrc,
      heroImageStyle,
      description,
      sections,
      languages,
      selectedLanguage,
      handleSelectLanguage
    } = this.props;

    return (
      <div className="sticky-list">
        <div className="sticky-list__hero" style={heroImageStyle && heroImageStyle.container}>
          <div className="sticky-list__hero__overlay" style={heroImageStyle && heroImageStyle.overlay}>
          </div>
          <img className="sticky-list__hero__image" src={heroImageSrc} style={heroImageStyle && heroImageStyle.img} />
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
        >{parse(description)}</div>

        <p className="sticky-list__mobile">
          <i>This interactive guide is best viewed on a mobile device.</i>
        </p>

        {languages && (
          <div className="sticky-list__language">
            <DropDownSelector 
              options={languages}
              selectedItem={selectedLanguage}
              handleSelectItem={handleSelectLanguage}
              id="language-btn"
            />
          </div>
        )}

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
