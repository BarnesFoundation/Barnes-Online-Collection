import React, { Component } from 'react';
import { getRoomAndTitleText } from '../../../ensembleIndex';
import { getArtObjectUrlFromId, getQueryKeywordUrl } from '../../../helpers';
import '../../../components/SummaryTable/index.css';

class SummaryTable extends Component {

  /** Generates the text for the artist line */	
  generateArtist = () => {
	const { people, nationality, birthDate, deathDate, artistPrefix, artistSuffix } = this.props;
	const unidentified = people.toLowerCase().includes('unidentified');

	let artistString = `${people}`;

	// Add prefix and suffix to artist string
	if (artistPrefix) { artistString = `${artistPrefix} ${artistString}`; }
	if (artistSuffix) { artistString += (artistSuffix[0] === ',') ? artistSuffix : ` ${artistSuffix}`; }

	// If not unidentified, progressively add nationality, birth date, death date
	if (!unidentified && (nationality || birthDate)) {
		let aString = '';

		if (nationality) { aString += nationality; }
		if (nationality && birthDate) { aString += ', '; }
		if (birthDate) { aString += `${birthDate}`; }
		if (deathDate) { aString += ` - ${deathDate}`; }

		artistString = `${artistString} (${aString})`;
	}
	return `${artistString}`
  }

  render() {
    const copyrightLink = this.props.objectCopyrightDetails.link;
    const copyrightCopy = this.props.objectCopyrightDetails.copy;
    const ensembleUrl = getArtObjectUrlFromId(this.props.id, this.props.title, 'ensemble');
    const roomAndTitleText = this.props.onview && (getRoomAndTitleText(this.props.ensembleIndex) || '');
    const curatorialApproval = (this.props.curatorialApproval === 'true') ? true : false;

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
            <div className="text color-light">
              <a href={getQueryKeywordUrl(this.props.people)}>{this.generateArtist()}</a>
            </div>
          </div>
        }
        {this.props.culture &&
          <div className="table-row">
            <div className="text">Culture</div>
            <div className="text color-light">
              <a href={getQueryKeywordUrl(this.props.culture)}>
                {this.props.culture}
              </a>
            </div>
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
        {this.props.creditLine &&
        <div className="table-row">
          <div className="text"></div>
          <div className="text color-light">{this.props.creditLine}</div>
        </div>
        }
        {/* this.props.publishedProvenance &&
        <div className="table-row">
          <div className="text">Provenance</div>
          <div className="text color-light" dangerouslySetInnerHTML={{__html: this.props.publishedProvenance}}/>
        </div> */
        }
        {!curatorialApproval &&
          <div className="table-row">
            <div className="text">Disclaimer</div>
            <div className="text color-light">Please note that not all records are complete as research on the collection is ongoing.</div>
          </div>
        }
      </div>
    );
  }
}

export default SummaryTable;
