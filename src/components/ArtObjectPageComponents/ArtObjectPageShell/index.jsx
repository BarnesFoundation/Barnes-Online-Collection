import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TabbedSubMenu from '../../../components/ArtObjectPageComponents/TabbedSubMenu';
import * as ObjectActions from '../../../actions/object';
import * as PrintActions from '../../../actions/prints';

import './index.css';

class ArtObjectPageShell extends Component {
  constructor(props) {
    super(props);

    this.loadInitialData(this.props);
  }

  loadInitialData(props) {
    const shouldLoadPrints = props.prints.length === 0;

    if (shouldLoadPrints) {
      props.getPrints();
    }

    props.getObject(props.requestObjectId);
  }

  updateObjectData(nextProps) {
    const shouldLoadNewObject = nextProps.requestObjectId &&
      nextProps.requestObjectId !== parseInt(nextProps.object.id, 10)

    if (shouldLoadNewObject) {
      nextProps.getObject(nextProps.requestObjectId);
    }
  }

  componentWillUpdate(nextProps) {
    this.updateObjectData(nextProps);
  }

  render() {
    return (
      <div className="component-art-object-page-shell">
        <div className="container">
          <h1 className="art-object__title font-gamma" style={{ marginBottom: 0 }}>{this.props.object.people}</h1>
          <h1 className="art-object__title font-gamma color-light" style={{ marginBottom: 0 }}>{this.props.object.title}</h1>
          <h1 className="art-object__title font-epsilon">{this.props.object.displayDate}. {this.props.object.medium}</h1>
        </div>
        <TabbedSubMenu
          slug={this.props.slug}
          object={this.props.object}
          modalPreviousLocation={this.props.modalPreviousLocation}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    object: state.object,
    prints: state.prints,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, ObjectActions, PrintActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ArtObjectPageShell);
