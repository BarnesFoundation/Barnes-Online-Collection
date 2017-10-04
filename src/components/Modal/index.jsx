import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as UIActions from '../../actions/ui';
import * as HtmlClassManagerActions from '../../actions/htmlClassManager';
import Icon from '../../components/Icon.jsx';
import { CLASSNAME_NAV_ACTIVE } from '../../constants';
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
    // todo #historyGoBack ensure we're going back to the exact history state
    this.props.history.goBack();
    this.props.htmlClassesRemove(CLASSNAME_NAV_ACTIVE);
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
        {
          this.props.children
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    modalIsOpen: state.ui.modalIsOpen,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({},
    UIActions,
    HtmlClassManagerActions
  ), dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Modal));
