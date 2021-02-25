import React from "react";
import axios from "axios";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as ObjectActions from "../../actions/object";
import { SiteHeader } from "../../components/SiteHeader/SiteHeader";
import SiteHtmlHelmetHead from "../SiteHtmlHelmetHead";
import HtmlClassManager from "../HtmlClassManager";
import Footer from "../Footer/Footer";
import StickyList from "../StickyList/StickyList";
import "./tourPage.css";

// to do
// sticky-list can't be fixed because then a scroll event does not trigger
// and that means that the top menu header does not collapse
// look into the scroll listener that is done in the SiteHeader and see if we
// can adapt to the section headers

class TourPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tourId: null,
      title: null,
      objects: null,
      roomOrder: null,
    };
  }

  async componentDidMount() {
    // Extract the slug for this tour
    const { id } = this.props.match.params;

    // If we have a slug, retrieve information for the tour
    if (id) {
      try {
        const tourResponse = await axios.get(`/api/tour/${id}`);
        this.setState({
          title: tourResponse.data.title,
          objects: tourResponse.data.data.hits.hits,
          roomOrder: tourResponse.data.customRoomOrder,
        });
      } catch (error) {
        console.log(
          `An error occurred retrieving the tour for id ${id}`,
          error
        );
      } finally {
        this.setState({
          ...this.state,
          tourId: id,
        });
      }
    }
  }

  formatTourData() {
    const lorem =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nunc vel risus commodo viverra maecenas accumsan lacus vel. Semper auctor neque vitae tempus quam. Accumsan tortor posuere ac ut consequat semper. Volutpat ac tincidunt vitae semper quis lectus nulla at volutpat. Tortor dignissim convallis aenean et tortor at. Integer enim neque volutpat ac tincidunt vitae semper quis lectus. Tempor id eu nisl nunc. Vel facilisis volutpat est velit egestas dui id ornare arcu. Libero volutpat sed cras ornare.";

    return [
      { header: "Room 1", content: lorem },
      { header: "Room 2", content: lorem },
      { header: "Room 3", content: lorem },
      { header: "Room 4", content: lorem },
      { header: "Room 5", content: lorem },
      { header: "Room 6", content: lorem },
      { header: "Room 7", content: lorem },
    ];
  }

  render() {
    const { tourId, title, objects } = this.state;

	return (
      <div className="app app-tour-page">
        <SiteHtmlHelmetHead />
        <HtmlClassManager />
        <SiteHeader isTour />
        {tourId && title && objects ? (
          // Display the tour if it was located
          <div className="tour-page-container">
            <StickyList
              title={title}
              heroImage="https://d2r83x5xt28klo.cloudfront.net/6814_mpfCoboPefnN6Ws6_n.jpg"
              sections={this.formatTourData()}
            />
          </div>
        ) : (
          // Otherwise, no tour found for that id
          <div className="container tour-page-container">
            <p>Could not find tour with id "{tourId}"</p>
          </div>
        )}
        <div style={{ "background-color": "white", "z-index": "1" }}>
          <Footer />
        </div>
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

const compWithRouter = withRouter(TourPage);
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(compWithRouter)
);
