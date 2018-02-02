import React, { Component } from 'react';
import './index.css';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ObjectActions from '../../../actions/object';
import * as PrintActions from '../../../actions/prints';
import AccordionMenu from '../../../components/AccordionMenu';
import SummaryTable from './SummaryTable';
import Zoom from '../../../components/Zoom/Zoom';
import { getObjectCopyright } from '../../../copyrightMap';

// use JSON.parse to parse string "true" or "false"
const isZoomEnabled = process.env.REACT_APP_FEATURE_ZOOMABLE_IMAGE && JSON.parse(process.env.REACT_APP_FEATURE_ZOOMABLE_IMAGE);

const getTabList = (artObjectProps) => {
  return [
    {
      title: 'Long Description',
      tabContent: artObjectProps.longDescription,
    },
    {
      title: 'Visual Description',
      tabContent: artObjectProps.visualDescription,
    },
    {
      title: 'Bibliography',
      tabContent: artObjectProps.bibliography,
    },
    {
      title: 'Exhibition History',
      tabContent: artObjectProps.exhibitionHistory,
    },
  ].filter((obj) => {
    // filter out ones with no content
    return !!obj.tabContent;
  });
};

class PanelDetails extends Component {
  render() {
    const object = this.props.object;
    const printAvailable = this.props.prints.find((print) => {
      return print.id === object.invno
    });

    const objectCopyrightDetails = getObjectCopyright(object);
    const accordionTabList = getTabList(object);

    const requestImageUrl = `https://barnesfoundation.wufoo.com/forms/barnes-foundation-image-request/def/field22=${object.people}&field21=${object.title}&field20=${object.invno}`;
    const downloadRequestUrl = `https://barnesfoundation.wufoo.com/forms/barnes-foundation-image-use-information/def/field22=${object.people}&field372=${object.title}&field20=${object.invno}&field374=${object.imageUrlForWufoo}`;

    return (
      <div className="art-object-page__panel-details">
        <div className="art-object__header m-block">
          {(
            objectCopyrightDetails.type === "large" &&
            isZoomEnabled
          ) ?
            <div>
              <Zoom invno={object.invno} />
              <img
                aria-hidden="true"
                className="art-object__image art-object__image-hidden"
                src={object.imageUrlLarge}
                alt={object.title}
              />
            </div>
          :
            <div className="container-inner-narrow">
              <img className="art-object__image" src={object.imageUrlLarge} alt={object.title}/>
            </div>
          }
        </div>
        <div className="art-object__more-info m-block m-block--shallow">
          <div className="container-inner-narrow">
            <SummaryTable {...object} objectCopyrightDetails={objectCopyrightDetails}/>

            <div className="m-block m-block--no-border m-block--shallow m-block--flush-top">
              {objectCopyrightDetails.type === "large" ?
                <a className="btn btn--primary" href={downloadRequestUrl} target="_blank" rel="noopener noreferrer nofollow" >
                  Download Image
                </a>
              :
                <a className="btn btn--primary" href={requestImageUrl} target="_blank" rel="noopener noreferrer nofollow" >
                  Request Image
                </a>
              }

              {printAvailable &&
                <a className="btn" href={printAvailable.url} target="_blank" rel="noopener noreferrer nofollow" >
                Purchase Print
                </a>
              }
            </div>

            {
              object.shortDescription &&
              <div className="art-object__more-info m-block m-block--shallow">
                <div className="art-object__short-description"
                  dangerouslySetInnerHTML={{__html: object.shortDescription}}
                ></div>
              </div>
            }

            {
              accordionTabList.length > 0 &&
              <AccordionMenu tabList={accordionTabList} />
            }
          </div>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    object: state.object,
    prints: state.prints,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, ObjectActions, PrintActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PanelDetails);
