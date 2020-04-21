import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TabbedSubMenu from '../../../components/ArtObjectPageComponents/TabbedSubMenu';
import * as ObjectActions from '../../../actions/object';
import * as PrintActions from '../../../actions/prints';
import { modalHide } from '../../../actions/modal';
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
    const { object, modalHide, isModal } = this.props;

    return (
      <div className="component-art-object-page-shell">
        <div className="container">
          {
          isModal 
            ? <button
                className="art-object__back"
                onClick={modalHide}
              >
                <span className="art-object__back-content">Continue Exploring the Collection</span>
              </button>
            : <a
                className="art-object__back-link"
                href="/"
              >
                <span className="art-object__back-content art-object__back-content--link">Continue Exploring The Collection</span>
              </a>
          }
          <h1 className="art-object__title art-object__title--main art-object__title--top font-gamma">{object.people}</h1>
          <h1 className="art-object__title art-object__title--main font-gamma color-light">{object.title}</h1>
          <h1 className="art-object__title art-object__title--date font-epsilon">{object.displayDate && `${object.displayDate}.`} {this.props.object.medium}</h1>
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
    isModal: state.modal.modalIsOpen,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, ObjectActions, PrintActions, { modalHide }), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ArtObjectPageShell);
