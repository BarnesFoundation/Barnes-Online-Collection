import { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as HtmlClassManagerActions from "./actions/htmlClassManager";
import * as ModalActions from "./actions/modal";
import { withRouter } from "react-router";
import { CLASSNAME_NAV_ACTIVE } from "./constants";

class CommonWrap extends Component {
  constructor(props) {
    super(props);

    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  componentDidUpdate(prevProps) {
    // this.scrollToTopOnRouteChange(prevProps);
  }

  handleKeyDown(event) {
    // esc
    const isEscKey = event.keyCode === 27;
    if (isEscKey) {
      this.props.htmlClassesRemove(CLASSNAME_NAV_ACTIVE);
    }

    if (isEscKey && this.props.modalIsOpen) {
      this.props.modalHide();
    }
  }

  scrollToTopOnRouteChange(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return this.props.children;
  }
}

const mapStateToProps = (state) => {
  return {
    modalIsOpen: state.modal.modalIsOpen,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    Object.assign({}, HtmlClassManagerActions, ModalActions),
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CommonWrap));
