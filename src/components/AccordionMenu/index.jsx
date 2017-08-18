import React, { Component } from 'react';
import './index.css';

class AccordionMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIdx: null,
    };

    this.handleContentTabClick = this.handleContentTabClick.bind(this);
  }

  handleContentTabClick(idx) {
    return function(e) {
      // if it's already selected, toggle it closed
      const selectedIndex = this.state.selectedIdx === idx ? null : idx;

      this.selectTab(selectedIndex);
    }.bind(this);
  }

  selectTab(idx) {
    this.setState({selectedIdx: idx});
  }

  render() {
    return (
      <div>
        <div className="m-accordion-tabs" data-behavior="Accordion" role="tablist" data-close-others="true">
          {
            this.props.tabList
              .map((tabData, idx) => {
                const isSelected = idx === this.state.selectedIdx;

                const props = {
                  ...tabData,
                  idx: idx,
                  isSelected: isSelected,
                  handleContentTabClick: this.handleContentTabClick,
                };

                return (
                  <div>
                    <button type="button"
                      className="m-accordion-tabs__title font-delta"
                      aria-selected={isSelected}
                      role="tab"
                      tabIndex={idx}
                      aria-expanded={isSelected}
                      onClick={this.handleContentTabClick(idx)}
                    >
                      {tabData.title}
                      <span className="m-accordion-tabs__icon"><svg height={20} width={20}><use xlinkHref="#icon--icon_arrow_down" /></svg></span>
                    </button>
                    <div
                      className="m-accordion-tabs__body"
                      aria-labelledby={`accordion1494${idx}`}
                      aria-hidden={!isSelected}
                      role="tabpanel"
                      data-height=""
                    >
                      <tabData.contentBlock {...props}/>
                    </div>
                  </div>
                )
              })
          }
        </div>
      </div>
    )
  }
}

export default AccordionMenu;
