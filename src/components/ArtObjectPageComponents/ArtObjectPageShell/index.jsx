import React, { Component } from 'react';
import TabbedSubMenu from '../../../components/ArtObjectPageComponents/TabbedSubMenu';

import Icon from '../../../components/Icon.jsx';

class ArtObjectPageShell extends Component {
  render() {
    return (
      <div className="art-object-wrap">
        <Icon svgId='cross_page' classes='icon-cross-page'/>

        {
          <div className="container">
            <h1 style={{textAlign: 'center', margin: '0 0 2rem 0'}} className="art-object__title font-alpha">{this.props.object.title}</h1>
          </div>
        }
        <TabbedSubMenu
          slug={this.props.slug}
          object={this.props.object}
        />
      </div>
    );
  }
}

export default ArtObjectPageShell;
