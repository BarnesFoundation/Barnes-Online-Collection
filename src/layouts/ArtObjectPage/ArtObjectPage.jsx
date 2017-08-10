import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ObjectActions from '../../actions/object';
import * as PrintActions from '../../actions/prints';
import * as UIActions from '../../actions/ui';
import './artObjectPage.css';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import SiteHeader from '../../components/SiteHeader/SiteHeader';
import HtmlClassManager from '../../components/HtmlClassManager';
import TabbedContent from './TabbedContent/TabbedContent';

class ArtObjectPage extends Component {
  constructor(props) {
    super(props);

    const id = props.match.params.id;
    const panelSlug = props.match.params.panel || '';
    const panelSlugIdx = this.props.location.pathname.search(panelSlug);
    const baseUrl = panelSlugIdx ?
      this.props.location.pathname.slice(0, panelSlugIdx) :
      this.props.location.pathname;

    // todo: quick fix. move this to a router.
    const hasTrailingSlash = !!baseUrl.match(/^.*\/$/);

    if (!hasTrailingSlash) {
      window.location = baseUrl + '/';
    }

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
      <div className="app">
        <Helmet>
          <meta property="og:title" content={`${this.props.culture || this.props.people} - ${this.props.title}`} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={window.location.href} />
          <meta property="og:image" content={this.props.imageUrlLarge} />
        </Helmet>
        <HtmlClassManager />
        <SiteHeader />
        {/*
          <h1>Art Object Page</h1>
        */}
        <div
          className="container"
          onKeyUp={this.handleKeyUp}
        >
          <TabbedContent
            slug={this.state.panelSlug}
            baseUrl={this.state.baseUrl}
          />
        </div>
        <footer className="art-object__footer no-print">
          <Link to="/">Back to Results</Link>
        </footer>
      </div>
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
