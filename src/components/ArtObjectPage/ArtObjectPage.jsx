import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router'
import * as ObjectActions from '../../actions/object';
import {getMetaTagsFromObject} from '../../helpers';
import { SiteHeader } from '../../components/SiteHeader/SiteHeader';
import SiteHtmlHelmetHead from '../SiteHtmlHelmetHead';
import HtmlClassManager from '../HtmlClassManager';
import ArtObjectPageShell from '../ArtObjectPageComponents/ArtObjectPageShell';
import Footer from '../Footer/Footer';
import './artObjectPage.css';

class ArtObjectPage extends Component {
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
    const object = this.props.object;
    const metaTags = getMetaTagsFromObject(object);

    return (
      <div className="app app-art-object-page">
        <SiteHtmlHelmetHead metaTags={metaTags} />
        <HtmlClassManager />
        <SiteHeader isArtObject/>
        <ArtObjectPageShell
          slug={this.state.panelSlug}
          requestObjectId={this.state.requestObjectId}
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
