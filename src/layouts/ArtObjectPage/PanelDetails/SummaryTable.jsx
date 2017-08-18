import React, { Component } from 'react';

import '../../../components/FlexboxTable/index.css';

class FlexboxTable extends Component {
  render() {
    return (
      <div className="table-flexbox">
        {this.props.people &&
          <div className="table-row">
            <div className="text">Artist</div>
            <div className="text">{this.props.people}</div>
          </div>
        }
        {this.props.culture &&
          <div className="table-row">
            <div className="text">Culture</div>
            <div className="text">{this.props.culture}</div>
          </div>
        }
        <div className="table-row">
          <div className="text">Date</div>
          <div className="text">{this.props.displayDate}</div>
        </div>
        <div className="table-row">
          <div className="text">Medium</div>
          <div className="text">{this.props.medium}</div>
        </div>
        <div className="table-row">
          <div className="text">ID</div>
          <div className="text">*todo*</div>
        </div>
        <div className="table-row">
          <div className="text">Accession Number</div>
          <div className="text">*todo*</div>
        </div>
        <div className="table-row">
          <div className="text">Dimensions</div>
          <div className="text">{this.props.dimensions}</div>
        </div>
      </div>
    );
  }
}

export default FlexboxTable;
