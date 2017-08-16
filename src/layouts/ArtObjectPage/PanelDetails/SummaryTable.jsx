import React, { Component } from 'react';

import '../../../components/FlexboxTable/index.css';

class FlexboxTable extends Component {
  render() {
    return (
      <div className="table-flexbox">
        <div className="table-row">
          <div className="text">Artist</div>
          <div className="text">val</div>
        </div>
        <div className="table-row">
          <div className="text">Year</div>
          <div className="text">val</div>
        </div>
        <div className="table-row">
          <div className="text">Medium</div>
          <div className="text">val</div>
        </div>
        <div className="table-row">
          <div className="text">ID</div>
          <div className="text">val</div>
        </div>
        <div className="table-row">
          <div className="text">Accession Number</div>
          <div className="text">Accession val</div>
        </div>
        <div className="table-row">
          <div className="text">Dimensions</div>
          <div className="text">val</div>
        </div>
      </div>
    );
  }
}

export default FlexboxTable;
