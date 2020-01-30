import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ModalActions from '../../actions/modal'
import * as HtmlClassManagerActions from '../../actions/htmlClassManager';
import Icon from '../Icon.jsx';
import { Footer } from '../Footer/Footer';
import { CLASSNAME_MODAL_OPEN } from '../../constants';
import { withRouter } from 'react-router'

import './index.css';

class Modal extends Component {
  constructor(props) {
    super(props);
    this.handleClickBtnClose = this.handleClickBtnClose.bind(this);
  }

  handleClickBtnClose(e) {
    e.preventDefault();

    this.props.modalHide();
  }

  closeModal() {
    const modalParentPathname = this.props.modalParentState.pathname;

    this.props.htmlClassesRemove(CLASSNAME_MODAL_OPEN);

    this.props.history.push(modalParentPathname);
  }

  componentDidUpdate(prevProps) {
    // ensure the modal is always scrolled to the top
    if (this.el && this.props.modalIsOpen !== prevProps.modalIsOpen) {
      this.el.scrollTop = 0;
    }

    if (prevProps.modalIsOpen && !this.props.modalIsOpen) {
      this.closeModal();
    }
  }

  render() {
    return (
      <div
        className="component-modal"
        ref={(div) => { this.el = div; }}
      >
        <div className="container">
          <div className="btn-wrap">
            <button
              className="btn-close"
              onClick={this.handleClickBtnClose}
            >
              <Icon svgId='cross_page' classes='icon-cross-page'/>
            </button>
          </div>
        </div>
        {this.props.children}
        <Footer />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    modalIsOpen: state.modal.modalIsOpen,
    modalParentState: state.modal.modalParentState,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({},
    ModalActions,
    HtmlClassManagerActions
  ), dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Modal));
