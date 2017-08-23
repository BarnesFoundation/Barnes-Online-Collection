import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router'
import * as ObjectActions from '../../actions/object';
import * as PrintActions from '../../actions/prints';
import * as UIActions from '../../actions/ui';
import './artObjectPage.css';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { getArtObjectUrlFromId } from '../../helpers';
import SiteHeader from '../../components/SiteHeader/SiteHeader';
import HtmlClassManager from '../../components/HtmlClassManager';
import TabbedContent from './TabbedContent/TabbedContent';
import Footer from '../../components/Footer/Footer';

class ArtObjectPage extends Component {
  constructor(props) {
    super(props);

    const urlPath = this.props.location.pathname;
    const artObjectId = props.match.params.id;
    const panelSlug = props.match.params.panel || '';
    const baseUrlMatch = urlPath.match('/objects/[0-9]*/');

    if (!baseUrlMatch) {
      // it's missing the slash. Do a quick redirect here for now.
      // todo: it'd be better to move this to a router later.
      window.location = window.location.pathname + '/';
      return;
    }

    this.state = {
      panelSlug: panelSlug,
      baseUrl: baseUrlMatch[0],
      artObjectId: artObjectId,
    };

    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.prints.length === 0) {
      this.props.getPrints();
    }
  }

  componentDidUpdate(nextProps, nextState) {
    const newArtObjectId = parseInt(this.props.match.params.id, 10)
    const currentArtObjectId = parseInt(this.props.artObject.id, 10)
    const isObjectStale = currentArtObjectId !== newArtObjectId;
    const newPanelSlug = this.props.match.params.panel || '';
    const isPanelStale = newPanelSlug !== this.state.panelSlug;

    if(isObjectStale) {
      this.props.getObject(newArtObjectId);
    }

    if (isPanelStale) {
      this.setState({
        panelSlug: newPanelSlug,
      });
    }
  }

  handleKeyUp(e) {
    if (e.which === 27) {
      this.props.hideZoomOverlay();
    }
  }

  handleFormSubmit(e) {
    e.preventDefault();
    this.props.submitDownloadForm(this.props.artObject.invno, this.downloadReason.value);
    this.downloadReason.value = '';
    this.downloadToggle.checked = false;

  }

  render() {
    const pageTitle = `${this.props.artObject.culture || this.props.artObject.people} - ${this.props.artObject.title}`;

    return (
      <div className="app">
        <Helmet>
          <title>{pageTitle} </title>
          <meta property="og:title" content={pageTitle} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={this.props.location.href} />
          <meta property="og:image" content={this.props.artObject.imageUrlLarge} />
        </Helmet>
        <HtmlClassManager />
        <SiteHeader />

        {/* todo: temp quick style. Need to get the AI for this page. */}
        {
          <div className="container">
            <h1 style={{textAlign: 'center', margin: '0 0 2rem 0'}} className="art-object__title font-alpha">{this.props.artObject.title}</h1>
          </div>
        }
        <TabbedContent
          onKeyUp={this.handleKeyUp}
          slug={this.state.panelSlug}
          artObject={this.props.artObject}
        />
        <Footer />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return Object.assign({}, {artObject: state.object}, { prints: state.prints }, { ui: state.ui });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, ObjectActions, PrintActions, UIActions), dispatch);
}

const compWithRouter = withRouter(ArtObjectPage);
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(compWithRouter));
