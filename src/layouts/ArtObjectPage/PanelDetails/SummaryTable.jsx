import React, { Component } from 'react';

import '../../../components/FlexboxTable/index.css';

class FlexboxTable extends Component {
  render() {
    return (
      <div className="m-block table-flexbox component-summary-table m-block--flush-top m-block--shallow m-block--no-border">
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
          <div className="text">ID</div>
          <div className="text color-light">{this.props.id}</div>
        </div>
        <div className="table-row">
          <div className="text">Accession Number</div>
          <div className="text color-light">{this.props.invno}</div>
        </div>
        <div className="table-row">
          <div className="text">Dimensions</div>
          <div className="text color-light">{this.props.dimensions}</div>
        </div>
      </div>
    );
  }
}

export default FlexboxTable;
