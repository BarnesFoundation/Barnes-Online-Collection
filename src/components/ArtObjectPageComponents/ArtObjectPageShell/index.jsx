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

    this.loadData(this.props);
  }

  loadData(nextProps) {
    const isObjectStale = parseInt(nextProps.object.id, 10) !== nextProps.artObjectId;
    const hasNotLoadedPrints = nextProps.prints.length === 0;

    if (hasNotLoadedPrints) {
      nextProps.getPrints();
    }

    if (isObjectStale) {
      nextProps.getObject(nextProps.artObjectId);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.loadData(nextProps);
  }

  render() {
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
