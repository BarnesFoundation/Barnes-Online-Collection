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
      this.selectTab(idx);
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

                return <tabData.contentBlock {...props}/>;
              })
          }
        </div>
      </div>
    );
  }
}

export default AccordionMenu;
