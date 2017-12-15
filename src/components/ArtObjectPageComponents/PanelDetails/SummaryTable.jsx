import React, { Component } from 'react';
import { getRoomAndTitleText } from '../../../ensembleIndex';
import { getArtObjectUrlFromId } from '../../../helpers';

import '../../../components/FlexboxTable/index.css';

class FlexboxTable extends Component {
  render() {
    const copyrightLink = this.props.objectCopyrightDetails.link;
    const copyrightCopy = this.props.objectCopyrightDetails.copy;
    const ensembleUrl = getArtObjectUrlFromId(this.props.id, 'ensemble');
    const roomAndTitleText = this.props.onview && (getRoomAndTitleText(this.props.ensembleIndex) || '');

    return (
      <div className="m-block table-flexbox component-summary-table m-block--flush-top m-block--shallow m-block--no-border">
        <div className="table-row">
          <div className="text">Location</div>
          <div className="text color-light">
          {this.props.onview &&
              <span>On View: <a href={ensembleUrl}>{roomAndTitleText}</a></span>
          }
          {!this.props.onview &&
              <span>Off View</span>
          }
          </div>
        </div>
        {this.props.people &&
          <div className="table-row">
            <div className="text">Artist</div>
            <div className="text color-light">{this.props.people}</div>
          </div>
        }
        {this.props.culture &&
          <div className="table-row">
            <div className="text">Culture</div>
            <div className="text color-light">{this.props.culture}</div>
          </div>
        }
        <div className="table-row">
          <div className="text">Year</div>
          <div className="text color-light">{this.props.displayDate}</div>
        </div>
        <div className="table-row">
          <div className="text">Medium</div>
          <div className="text color-light">{this.props.medium}</div>
        </div>
        <div className="table-row">
          <div className="text">Accession Number</div>
          <div className="text color-light">{this.props.invno}</div>
        </div>
        <div className="table-row">
          <div className="text">Dimensions</div>
          <div className="text color-light">{this.props.dimensions}</div>
        </div>
        <div className="table-row">
          <div className="text">Copyright Status</div>
          <div className="text color-light">
            {
              copyrightLink ?
                <a
                  className="a-brand-link"
                  href={copyrightLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {copyrightCopy}
                </a>
              :
              <span>{copyrightCopy}</span>
            }
          </div>
        </div>
        <div className="table-row">
          <div className="text"></div>
          <div className="text color-light">{this.props.creditLine}</div>
        </div>
        {this.props.provenance &&
        <div className="table-row">
          <div className="text">Provenance</div>
          <div className="text color-light">{this.props.provenance}</div>
        </div>
        }
      </div>
    );
  }
}

export default FlexboxTable;
