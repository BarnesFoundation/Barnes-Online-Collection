import React, { Component } from 'react';
import TabbedSubMenu from '../../../components/ArtObjectPageComponents/TabbedSubMenu';
// import { STYLE_MODAL } from '../../../constants';

import './index.css';

class ArtObjectPageShell extends Component {
  constructor(props) {
    super(props);

    // this.isModal = this.props.componentStyle === STYLE_MODAL;
    // only the modal style can be open
    // this.isOpen = this.isModal && this.props.isOpen;
  }

  render() {
    return (
      <div className="component-art-object-page-shell" data-component-style={this.props.componentStyle}>
        <div className="container">
          <h1 style={{textAlign: 'center', margin: '0 0 2rem 0'}} className="art-object__title font-alpha">{this.props.object.title}</h1>
        </div>
        <TabbedSubMenu
          slug={this.props.slug}
          object={this.props.object}
        />
      </div>
    );
  }
}

export default ArtObjectPageShell;
