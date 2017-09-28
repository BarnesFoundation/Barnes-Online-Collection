import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as UIActions from '../../actions/ui';
import Icon from '../../components/Icon.jsx';
import './index.css';

class Modal extends Component {
  constructor(props) {
    super(props);
    this.handleClickBtnClose = this.handleClickBtnClose.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  handleClickBtnClose(e) {
    e.preventDefault();

    this.props.modalHide();
  }

  // todo: this should move to a higher up component so the keyboard event will always be in focus
  handleKeyUp(e) {
    if (e.which === 27) {
      this.props.modalHide();
    }
  }

  render() {
    return (
      <div
        className="component-modal"
        onKeyUp={this.handleKeyUp}
        data-modal-is-open={this.props.modalIsOpen}
      >
        <button
          className="btn btn-close"
          onClick={this.handleClickBtnClose}
        >
          <Icon svgId='cross_page' classes='icon-cross-page'/>
        </button>
        {
          this.props.children
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    modalIsOpen: state.ui.modalIsOpen
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, UIActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
