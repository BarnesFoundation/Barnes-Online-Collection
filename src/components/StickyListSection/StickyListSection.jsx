import React, { Component } from "react";
import classnames from "classnames";
import { ObjectCard } from "../ObjectCard/ObjectCard";
import "./stickyListSection.css";

export class StickyListSection extends Component {
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
        className="sticky-list-section"
        ref={(section) => {
          this.section = section;
        }}
      >
        {this.props.header && (
          <div
            className={classnames("sticky-list-section__header", {
              fixed: this.state.isFixed,
              absolute: this.state.isAbsolute,
            })}
            ref={(header) => {
              this.header = header;
            }}
          >
            <div className="sticky-list-section__header-text">
              {this.props.header}
            </div>
          </div>
        )}

        <div className="sticky-list-section__content">
          {this.props.content.map((obj) => {
            return <ObjectCard object={obj} key={obj.id} />;
          })}
        </div>
      </div>
    );
  }
}
