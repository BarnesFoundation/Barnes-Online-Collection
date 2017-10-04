import React, { Component } from 'react';
import ArtObjectPageShell from '../ArtObjectPageShell';
import Modal from '../../Modal';

import './index.css';

class ModalArtObjectPage extends Component {
  constructor(props) {
    super(props);

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

export default ModalArtObjectPage;
