import React, { Component } from "react";
import { getRoomAndTitleText } from "../../../ensembleIndex";
import { getArtObjectUrlFromId } from "../../../helpers";
import "../../../components/SummaryTable/index.css";

const getArtistLink = (artistName) =>
  `/objects/?qtype=filter&qval={%22advancedFilters%22:{%22Artist%22:{%22${artistName}%22:{%22filterType%22:%22Artist%22,%22value%22:%22${artistName}%22,%22term%22:%22${artistName}%22,%22index%22:1}}}}`;
const getCultureLink = (cultureName) =>
  `/objects/?qtype=filter&qval={%22advancedFilters%22:{%22Artist%22:{},%22Culture%22:{%22${cultureName}%22:{%22filterType%22:%22Culture%22,%22value%22:%22${cultureName}%22,%22term%22:%22${cultureName}%22,%22index%22:1}}}}`;

class SummaryTable extends Component {
  /** Generates the text for the artist line */
  generateArtist = () => {
    const {
      people,
      nationality,
      birthDate,
      deathDate,
      artistPrefix,
      artistSuffix,
    } = this.props;
    const unidentified = people.toLowerCase().includes("unidentified");

    let artistString = `${people}`;

    // Add prefix and suffix to artist string
    if (artistPrefix) {
      artistString = `${artistPrefix} ${artistString}`;
    }
    if (artistSuffix) {
      artistString +=
        artistSuffix[0] === "," ? artistSuffix : ` ${artistSuffix}`;
    }

    // If not unidentified, progressively add nationality, birth date, death date
    if (!unidentified && (nationality || birthDate)) {
      let aString = "";

      if (nationality) {
        aString += nationality;
      }
      if (nationality && birthDate) {
        aString += ", ";
      }
      if (birthDate) {
        aString += `${birthDate}`;
      }
      if (deathDate) {
        aString += ` - ${deathDate}`;
      }

      artistString = `${artistString} (${aString})`;
    }
    return `${artistString}`;
  };

  /** Renders the structured multi-constituent attribution: for each constituent,
   *  "[prefix ]name[suffix][, nationality, dates]", the name linked to the artist filter,
   *  joined by "; ". Reproduces the curatorial format (e.g. BF854: "Unidentified artist,
   *  Brescian School; Formerly attributed to Titian (Tiziano Vecellio), Italian, Venetian,
   *  c. 1488–1576"). Falls back to generateArtist() when no structured constituents exist. */
  renderConstituents = () => {
    return this.props.constituents.map((c, i) => {
      let tail = "";
      if (c.suffix) tail += c.suffix[0] === "," ? c.suffix : ` ${c.suffix}`;
      if (c.displayDate) tail += `, ${c.displayDate}`;
      return (
        <React.Fragment key={i}>
          {i > 0 ? "; " : ""}
          {c.prefix ? `${c.prefix} ` : ""}
          {c.name ? <a href={getArtistLink(c.name)}>{c.name}</a> : null}
          {tail}
        </React.Fragment>
      );
    });
  };

  render() {
    const copyrightLink = this.props.objectCopyrightDetails.link;
    const copyrightCopy = this.props.objectCopyrightDetails.copy;
    const ensembleUrl = getArtObjectUrlFromId(
      this.props.id,
      this.props.title,
      "ensemble"
    );
    const roomAndTitleText =
      this.props.onview &&
      (getRoomAndTitleText(this.props.ensembleIndex) || "");
    const curatorialApproval =
      this.props.curatorialApproval === "true" ? true : false;

    return (
      <div className="m-block table-flexbox component-summary-table m-block--flush-top m-block--shallow m-block--no-border">
        {/* Show the on-view location ONLY when the work is actually on view — the negative "Off View"
            messaging was flagged as confusing to visitors (doc: remove unless it is on view). */}
        {this.props.onview && (
          <div className="table-row">
            <div className="text">Location</div>
            <div className="text color-light">
              <span>
                On View: <a href={ensembleUrl}>{roomAndTitleText}</a>
              </span>
            </div>
          </div>
        )}
        {this.props.constituents && this.props.constituents.length > 0 ? (
          <div className="table-row">
            <div className="text">Artist</div>
            <div className="text color-light">{this.renderConstituents()}</div>
          </div>
        ) : (
          this.props.people && (
            <div className="table-row">
              <div className="text">Artist</div>
              <div className="text color-light">
                <a href={getArtistLink(this.props.people)}>
                  {this.generateArtist()}
                </a>
              </div>
            </div>
          )
        )}
        {this.props.culture && (
          <div className="table-row">
            <div className="text">Culture</div>
            <div className="text color-light">
              <a href={getCultureLink(this.props.culture)}>
                {this.props.culture}
              </a>
            </div>
          </div>
        )}
        <div className="table-row">
          <div className="text">Date</div>
          <div className="text color-light">{this.props.displayDate}</div>
        </div>
        <div className="table-row">
          <div className="text">Medium</div>
          <div className="text color-light">{this.props.medium}</div>
        </div>
        <div className="table-row">
          <div className="text">Object Number</div>
          <div className="text color-light">{this.props.invno}</div>
        </div>
        <div className="table-row">
          <div className="text">Dimensions</div>
          <div className="text color-light">{this.props.dimensions}</div>
        </div>
        {/* "Viewing Status" row removed: it duplicated the Location "On View" line, and its
            onview === "1" test was always false (onview is a boolean), so it showed "Currently not on
            view" for EVERY object. On-view status is now shown positively via the Location row above. */}
        <div className="table-row">
          <div className="text">Copyright Status</div>
          <div className="text color-light">
            {copyrightLink ? (
              <a
                className="a-brand-link"
                href={copyrightLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {copyrightCopy}
              </a>
            ) : (
              <span>{copyrightCopy}</span>
            )}
          </div>
        </div>
        {this.props.creditLine && (
          <div className="table-row">
            <div className="text"></div>
            <div className="text color-light">{this.props.creditLine}</div>
          </div>
        )}
        {!curatorialApproval && (
          <div className="table-row">
            <div className="text">Disclaimer</div>
            <div className="text color-light">
              Please note that not all records are complete as research on the
              collection is ongoing.
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default SummaryTable;
