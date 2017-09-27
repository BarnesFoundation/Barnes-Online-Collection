import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router'
import * as ObjectActions from '../../actions/object';
import { getArtObjectUrlFromId } from '../../helpers';
import { META_TITLE, CANONICAL_ROOT } from '../../constants';
import SiteHeader from '../../components/SiteHeader/SiteHeader';
import SiteHtmlHelmetHead from '../../components/SiteHtmlHelmetHead';
import HtmlClassManager from '../../components/HtmlClassManager';
import ArtObjectPageShell from '../../components/ArtObjectPageComponents/ArtObjectPageShell';
import Footer from '../../components/Footer/Footer';
import './artObjectPage.css';

class ArtObjectPage extends Component {
  constructor(props) {
    super(props);

    this.state = this.getState(this.props);
  }

  getState(nextProps) {
    const urlPath = nextProps.location.pathname;
    const baseUrlMatch = urlPath.match('/objects/[0-9]*/');

    // it's missing the slash. Do a quick redirect here for now.
    // todo: it'd be better to move this to a router later.
    if (!baseUrlMatch) {
      window.location = window.location.pathname + '/';
      return;
    }

    const artObjectId = parseInt(nextProps.match.params.id, 10);
    const panelSlug = nextProps.match.params.panel || '';

    return {
      panelSlug: panelSlug,
      artObjectId: artObjectId
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params !== nextProps.match.params) {
      this.setState(this.getState(nextProps));
    }
  }

  render() {
    const object = this.props.object;
    const metaTitle = `${META_TITLE} — ${object.culture || object.people}: ${object.title}`;
    const metaImage = object.imageUrlSmall;

    return (
      <div className="app app-art-object-page">
        <SiteHtmlHelmetHead
          metaTitle={metaTitle}
          metaImage={metaImage}
        />
        <HtmlClassManager />
        <SiteHeader />

        <ArtObjectPageShell
          slug={this.state.panelSlug}
          artObjectId={this.state.artObjectId}
        />

        <Footer />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    object: state.object,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign(
    {},
    ObjectActions,
  ), dispatch);
}

const compWithRouter = withRouter(ArtObjectPage);
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(compWithRouter));
