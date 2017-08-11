import React, { Component } from 'react';
import './index.css';

class PanelVisuallyRelated extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="m-block">
        <div className="m-block__columns">
          <div className="m-block__column">
            <p style={{background: '#eee'}}>PanelVisuallyRelated test - left</p>
          </div>
          <div className="m-block__column">
            <p style={{background: '#eee'}}>PanelVisuallyRelated test - right</p>
          </div>
        </div>
      </div>
    );
  }
}

export default PanelVisuallyRelated;
