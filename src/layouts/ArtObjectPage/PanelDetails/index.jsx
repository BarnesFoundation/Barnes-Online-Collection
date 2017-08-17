import React, { Component } from 'react';
import './index.css';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ObjectActions from '../../../actions/object';
import * as PrintActions from '../../../actions/prints';
import * as UIActions from '../../../actions/ui';
import AccordionMenu from '../../../components/AccordionMenu';
import LongDescription from './AccordionPanels/LongDescription';
import VisualDescription from './AccordionPanels/VisualDescription';
import Bibliography from './AccordionPanels/Bibliography';
import SummaryTable from './SummaryTable';
import Zoom from '../../../components/Zoom/Zoom';
import {COPYRIGHT_MAP} from '../../../constants';

const getCopyright = (id) => {
  if (!id) return {link: '', copy: 'No Known Copyright', type: 'small'};

  return COPYRIGHT_MAP[id];
};

class PanelDetails extends Component {
  constructor(props) {
    super(props);

    this.tabList = [
      {
        title: 'Long Description',
        contentBlock: LongDescription,
      },
      {
        title: 'Visual Description',
        contentBlock: VisualDescription,
      },
      {
        title: 'Bibliography',
        contentBlock: Bibliography,
      },
    ];
  }

  render() {
    const printAvailable = this.props.prints.find((print) => {
      return print.id === this.props.invno
    });

    return (
      <div className="art-object-page__panel-details">
        <div className="art-object__header m-block">
          <div className="art-object__image-container">
            <img className="art-object__image" src={this.props.imageUrlLarge} alt={this.props.title}/>
            <div className="art-object__image-options no-print">
              <button onClick={this.props.showZoomOverlay}>
                Zoom
              </button>
              {printAvailable &&
                <a href={printAvailable.url} target="_blank" rel="noopener noreferrer" >
                  Purchase Print
                </a>
              }
            </div>
          </div>
        </div>
        <div className="art-object__more-info m-block m-block--shallow">
          <div className="container-inner-narrow">
            <SummaryTable {...this.props}/>
            <div className="m-block m-block--no-border m-block--shallow">
              <button className="btn" type="button">Request Image</button>
              {printAvailable &&
                <a className="btn btn--primary" href={printAvailable.url} target="_blank" rel="noopener noreferrer" >
                Purchase Print
                </a>
              }
            </div>

            {/* todo - figure out what this text is and where it comes from */}
            <div className="art-object__more-info m-block m-block--shallow">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>

            <AccordionMenu tabList={this.tabList} />
          </div>
        </div>

        {/*todo: remove after clarifying design*/}
        {/*

        {this.props.provenance && <div className="art-object__more-info m-block">
          <h2>Provenance</h2>
          <p>{this.props.provenance}</p>
        </div>}

            <div className="art-object__tombstone">
              <div className="art-object__labels">
                {this.props.people && <p className="art-object__label">Artist</p>}
                {this.props.culture && <p className="art-object__label">Culture</p>}
                <p className="art-object__label">Date</p>
                <p className="art-object__label">Medium</p>
              </div>
              <div>
                {this.props.people && <p>{this.props.people}</p>}
                {this.props.culture && <p>{this.props.culture}</p>}
                <p>{this.props.displayDate}</p>
                <p>{this.props.medium}</p>
              </div>
              <div className="art-object__short-description"
                dangerouslySetInnerHTML={{__html: this.props.shortDescription || this.props.description}}
              ></div>
            </div>
            <div className="art-object__accordian-panel">
              <h2 className="art-object__accordian-title">Additional Information</h2>
              <div className="art-object__labels">
                <p className="art-object__label">Accession Number</p>
                <p className="art-object__label">Dimensions</p>
                <p className="art-object__label">Museum Location</p>
              </div>
              <div>
                <p>{this.props.invno}</p>
                <p>{this.props.dimensions}</p>
                <p>{`${this.props.room}, ${this.props.wall} Wall`}</p>
              </div>
            </div>

        <div className="art-object__more-info m-block">
          <h2>Copyright/Download</h2>
          <div className="art-object__label">
            <span>Copyright Status: </span>
            <a
              href={getCopyright(this.props.objRightsTypeId).link}
              target="_blank"
              rel="noopener noreferrer"
            >
            {getCopyright(this.props.objRightsTypeId).copy}
            </a>
            {getCopyright(this.props.objRightsTypeId).type === "small" ?
              <div className="no-print">
                <button>
                  Request Image
                </button>
              </div>
              :
              <div className="no-print">
                <button className="btn" type="button">Request Image</button>
                <label htmlFor="download-image-button" className="download-image-label btn btn--primary">Download</label>
                <input
                  type="checkbox"
                  id="download-image-button"
                  className="download-image-button"
                  ref={(element) => { this.downloadToggle = element; }}
                />
                <form onSubmit={this.handleFormSubmit} className="download-image-form">
                  <label htmlFor="reason">What do you want to use this image for?</label>
                  <textarea id="reason" ref={(element) => { this.downloadReason = element; }}>
                  </textarea>
                  <input type="submit" />
                </form>
              </div>
            }
          </div>
        </div>
        */}

        {this.props.ui.zoomOverlayVisible && <Zoom invno={this.props.invno} onExit={this.props.hideZoomOverlay}/>}
      </div>
    );
  }
}


function mapStateToProps(state) {
  return Object.assign({}, {...state.object}, { prints: state.prints }, { ui: state.ui });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, ObjectActions, PrintActions, UIActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PanelDetails);
