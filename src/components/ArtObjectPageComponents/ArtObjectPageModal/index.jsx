import React, { Component } from 'react';
import ArtObjectPageShell from '../ArtObjectPageShell';
import Modal from '../../Modal';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as UIActions from '../../../actions/ui';

import './index.css';

class ModalArtObjectPage extends Component {
  constructor(props) {
    super(props);

    this.props.modalShow();
    this.state = this.getState(this.props);
  }

  getState(nextProps) {
    const requestObjectId = parseInt(nextProps.match.params.id, 10);
    const panelSlug = nextProps.match.params.panel || '';

    return {
      panelSlug: panelSlug,
      requestObjectId: requestObjectId
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params !== nextProps.match.params) {
      this.setState(this.getState(nextProps));
    }
  }

  componentWillUnmount() {
    // ensure it's hidden because otherwise if the page navigates before it's hidden the "true" state might stick around
    this.props.modalHide();
  }

  render() {
    return (
      <Modal>
        <ArtObjectPageShell
          slug={this.state.panelSlug}
          requestObjectId={this.state.requestObjectId}
        />
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({},
    UIActions,
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalArtObjectPage);
