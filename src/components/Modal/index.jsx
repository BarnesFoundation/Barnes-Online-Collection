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
  }

  handleClickBtnClose(e) {
    e.preventDefault();

    this.props.modalHide();
  }

  componentDidUpdate(prevProps) {
    // ensure the modal is always scrolled to the top
    if (this.el && this.props.modalIsOpen !== prevProps.modalIsOpen) {
      this.el.scrollTop = 0;
    }
  }

  render() {
    return (
      <div
        className="component-modal"
        data-modal-is-open={this.props.modalIsOpen}
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
    modalIsOpen: state.ui.modalIsOpen
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, UIActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
