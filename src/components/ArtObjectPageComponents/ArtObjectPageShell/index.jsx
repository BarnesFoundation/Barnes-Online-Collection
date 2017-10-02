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
    const shouldLoadPrints = nextProps.prints.length === 0;
    const shouldLoadNewObject = nextProps.requestObjectId &&
      nextProps.requestObjectId !== parseInt(nextProps.object.id, 10)

    if (shouldLoadPrints) {
      nextProps.getPrints();
    }

    if (shouldLoadNewObject) {
      nextProps.getObject(nextProps.requestObjectId);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.loadData(nextProps);
  }

  render() {
    return (
      <div className="component-art-object-page-shell">
        <div className="container">
          <h1 className="art-object__title font-alpha">{this.props.object.title}</h1>
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
    ui: state.ui,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, ObjectActions, PrintActions, UIActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ArtObjectPageShell);
