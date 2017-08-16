import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import './index.css';

const tabList = [
  {
    title: 'Visually Related',
  },
  {
    title: 'Ensemble',
  },
  {
    title: 'Details',
  },
];

class AccordionMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabs: tabList,
      selectedIdx: 1,
    };
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
            this.state.tabs
              .map((tabData, idx) => {
                const isSelected = idx === this.state.selectedIdx;

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
                      Dining and Coffee
                      <span className="m-accordion-tabs__icon"><svg height={20} width={20}><use xlinkHref="#icon--icon_arrow_down" /></svg></span>
                    </button>
                    <div
                      className="m-accordion-tabs__body"
                      aria-labelledby={`accordion1494${idx}`}
                      aria-hidden={!isSelected}
                      role="tabpanel"
                      data-height=""
                    >
                      <div className="m-accordion-tabs__inner">
                        <p>bla bla</p>
                        <h4><strong>The Garden Restaurant</strong></h4>
                      </div>
                    </div>
                  </div>
                );
              })
          }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return Object.assign({}, {...state.object});
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AccordionMenu);
