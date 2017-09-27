import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TabbedSubMenu from '../../../components/ArtObjectPageComponents/TabbedSubMenu';
import * as ObjectActions from '../../../actions/object';
import * as PrintActions from '../../../actions/prints';
import * as UIActions from '../../../actions/ui';

import './index.css';

class ArtObjectPageShell extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.prints.length === 0) {
      this.props.getPrints();
    }

    this.props.getObject(this.props.artObjectId);
  }

  render() {
    if (!this.props.object) {
      return (
        <div>
          loading ...
        </div>
      );
    }

    return (
      <div className="component-art-object-page-shell">
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

function mapStateToProps(state) {
  return {
    object: state.object,
    prints: state.prints,
    ui: state.ui
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, ObjectActions, PrintActions, UIActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ArtObjectPageShell);
