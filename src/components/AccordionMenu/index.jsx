import React, { Component } from "react";
import "./index.css";

class AccordionMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIdx: null,
    };

    this.handleContentTabClick = this.handleContentTabClick.bind(this);
  }

  handleContentTabClick(idx) {
    return function (e) {
      // if it's already selected, toggle it closed
      const selectedIndex = this.state.selectedIdx === idx ? null : idx;

      this.selectTab(selectedIndex);
    }.bind(this);
  }

  selectTab(idx) {
    this.setState({ selectedIdx: idx });
  }

  render() {
    return (
      <div className="component-m-support-accordion">
        {this.props.tabList.map((tabData, idx) => {
          const isSelected = idx === this.state.selectedIdx;
          const tabContent = tabData.tabContent;

          return (
            <div
              key={idx}
              className="m-block m-block--shallow m-support-accordion-element"
            >
              <button
                type="button"
                className="font-delta m-block__shallow-title m-support-accordion__title"
                aria-selected={isSelected}
                role="tab"
                tabIndex={idx}
                aria-expanded={isSelected}
                onClick={this.handleContentTabClick(idx)}
              >
                <h3>{tabData.title}</h3>
                <span className="m-support-accordion__btn">
                  <span className="m-support-accordion__toggle--show">
                    Show details
                  </span>
                  <span className="m-support-accordion__toggle--hide">
                    Hide details
                  </span>
                </span>
              </button>
              <div
                className="m-support-accordion__body"
                aria-labelledby={`accordion1494${idx}`}
                aria-hidden={!isSelected}
                role="tabpanel"
                data-height=""
              >
                <div className="m-accordion-tabs__inner">
                  <div dangerouslySetInnerHTML={{ __html: tabContent }}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default AccordionMenu;
