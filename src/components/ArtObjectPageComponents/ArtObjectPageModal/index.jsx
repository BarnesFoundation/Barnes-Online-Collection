import React, { Component } from "react";
import ArtObjectPageShell from "../ArtObjectPageShell";
import Modal from "../../Modal";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as ModalActions from "../../../actions/modal";

import "./index.css";

class ModalArtObjectPage extends Component {
  constructor(props) {
    super(props);

    this.state = this.getState(this.props);
  }

  getState(nextProps) {
    const requestObjectId = parseInt(nextProps.match.params.id, 10);
    const panelSlug = nextProps.match.params.panel || "";

    return {
      panelSlug: panelSlug,
      requestObjectId: requestObjectId,
    };
  }

  componentDidMount() {
    this.props.modalShow();
  }

  componentWillUnmount() {
    if (this.props.history.action === "POP") {
      this.props.modalHide();
    }
  }

  componentWillUpdate(nextProps) {
    if (this.props.match.params !== nextProps.match.params) {
      this.setState(this.getState(nextProps));
    }
  }

  render() {
    return (
      <Modal>
        <ArtObjectPageShell
          slug={this.state.panelSlug}
          requestObjectId={this.state.requestObjectId}
          modalPreviousLocation={this.props.modalPreviousLocation}
        />
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, ModalActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalArtObjectPage);
