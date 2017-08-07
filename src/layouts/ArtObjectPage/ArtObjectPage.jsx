import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ObjectActions from '../../actions/object';
import * as PrintActions from '../../actions/prints';
import * as UIActions from '../../actions/ui';
import './artObjectPage.css';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import TabbedContent from './TabbedContent/TabbedContent';

const copyrightMap = {
  1: {
    copy: 'In Copyright',
    link: 'http://rightsstatements.org/page/InC/1.0/?language=en',
    type: 'small'
  },
  3: {
    copy: 'ARS',
    link: 'http://rightsstatements.org/page/InC/1.0/?language=en',
    type: 'small'
  },
  4: {
    copy: 'Public Domain',
    link: 'https://creativecommons.org/publicdomain/mark/1.0/',
    type: 'large'
  },
  8: {
    copy: 'No Known Rights: Public Domain',
    link: 'https://creativecommons.org/publicdomain/mark/1.0/',
    type: 'large'
  },
  2: {
    copy: 'World Rights: Copyright Undetermined',
    link: 'http://rightsstatements.org/page/UND/1.0/?language=en',
    type: 'small'
  },
  10: {
    copy: 'World Rights: Public Domain',
    link: 'https://creativecommons.org/publicdomain/mark/1.0/',
    type: 'large'
  },
  6: {
    copy: 'No Known Claimant',
    link: 'http://rightsstatements.org/page/UND/1.0/?language=en',
    type: 'small'
  }
}

class ArtObjectPage extends Component {
  constructor(props) {
    super(props);

    const id = props.match.params.id;
    const panelSlug = props.match.params.panel || '';
    const panelSlugIdx = this.props.location.pathname.search(panelSlug);
    const baseUrl = panelSlugIdx ?
      this.props.location.pathname.slice(0, panelSlugIdx) :
      this.props.location.pathname;

    this.state = {
      panelSlug: panelSlug,
      baseUrl: baseUrl,
    };

    if (!props.title) {
      this.props.getObject(id);
    }

    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.prints.length === 0) {
      this.props.getPrints();
    }
  }

  handleKeyUp(e) {
    if (e.which === 27) {
      this.props.hideZoomOverlay();
    }
  }

  handleFormSubmit(e) {
    e.preventDefault();
    this.props.submitDownloadForm(this.props.invno, this.downloadReason.value);
    this.downloadReason.value = '';
    this.downloadToggle.checked = false;

  }

  render() {
    return (
      <section className="art-object" onKeyUp={this.handleKeyUp}>
        <Helmet>
          <meta property="og:title" content={`${this.props.culture || this.props.people} - ${this.props.title}`} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={window.location.href} />
          <meta property="og:image" content={this.props.imageUrlLarge} />
        </Helmet>
        <div className="art-object__tabbed-content-test">
          <TabbedContent
            slug={this.state.panelSlug}
            baseUrl={this.state.baseUrl}
          />
        </div>
        <footer className="art-object__footer no-print">
          <Link to="/">Back to Results</Link>
        </footer>
      </section>
    );
  }
}

function mapStateToProps(state) {
  return Object.assign({}, {...state.object}, { prints: state.prints }, { ui: state.ui });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, ObjectActions, PrintActions, UIActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ArtObjectPage);
