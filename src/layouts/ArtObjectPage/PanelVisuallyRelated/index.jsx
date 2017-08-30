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
    const colorSwatches = [];

    if (this.props.color) {
      for (let i = 0; i < 5; i++) {
        colorSwatches.push(
          <div className="art-object__color-swatch" style={{backgroundColor: this.props.color[`palette-closest-${i}`]}}>
          </div>
        );
      }
    }

    return (
      <div className="m-block m-block--shallow">
        <div className="m-block__columns">
          <div className="m-block__column">
            <div className="art-object__image-container">
              <img className="art-object__image" src={this.props.imageUrlLarge} alt={this.props.title}/>
              <div className="art-object__colors">
                {colorSwatches}
              </div>
            </div>
            <div className="">
              <p>{getDisplayDateAndMedium(this.props.displayDate, this.props.medium)}</p>
            </div>
          </div>
          <div className="m-block__column">
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
