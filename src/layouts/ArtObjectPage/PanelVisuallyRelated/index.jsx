import React, { Component } from 'react';
import './index.css';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ArtObjectGrid from '../../../components/ArtObjectGrid/ArtObjectGrid';

import Slider from '../../../components/Slider/Slider.jsx';

const getDisplayDateAndMedium = (displayDate, medium) => {
  const connector = displayDate && medium ? '—' : '';

  return (displayDate || '') + connector + (medium || '');
};

class PanelVisuallyRelated extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="m-block m-block--shallow">
        <div className="m-block__columns">
          <div className="m-block__column m-block__column--page-col">
            <div className="art-object__image-container">
              <img className="art-object__image" src={this.props.imageUrlLarge} alt={this.props.title}/>
            </div>
            <div className="">
              <p>{getDisplayDateAndMedium(this.props.displayDate, this.props.medium)}</p>
            </div>
          </div>
          <div className="m-block__column m-block__column--page-col">
            <Slider
              labelLeft='More similar'
              labelRight='More surprising'
            />
            <ArtObjectGrid />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return Object.assign({}, {...state.object});
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PanelVisuallyRelated);
