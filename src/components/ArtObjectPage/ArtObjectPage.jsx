import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import * as ObjectActions from "../../actions/object";
import { getMetaTagsFromObject } from "../../helpers";
import { SiteHeader } from "../../components/SiteHeader/SiteHeader";
import SiteHtmlHelmetHead from "../SiteHtmlHelmetHead";
import HtmlClassManager from "../HtmlClassManager";
import ArtObjectPageShell from "../ArtObjectPageComponents/ArtObjectPageShell";
import Footer from "../Footer/Footer";
import { trackEvent } from "../../analytics";
import "./artObjectPage.css";

class ArtObjectPage extends Component {
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
    this.trackObjectView();
  }

  componentDidUpdate() {
    this.trackObjectView();
  }

  /** view_item once per object shown (the object arrives after the route changes). */
  trackObjectView() {
    const { object } = this.props;
    if (!object || !object.id || object.id === this.trackedObjectId) return;
    if (Number(object.id) !== this.state.requestObjectId) return;
    this.trackedObjectId = object.id;
    trackEvent("view_item", {
      object_id: String(object.id),
      object_title: object.title,
      artist: object.people,
    });
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
        <SiteHeader isArtObject />
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
  return bindActionCreators(Object.assign({}, ObjectActions), dispatch);
}

const compWithRouter = withRouter(ArtObjectPage);
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(compWithRouter)
);
