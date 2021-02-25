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

// default room order for tours, currently using the COVID flow
export const DEFAULT_ROOM_ORDER = [
  "Main Room",
  "Room 7",
  "Room 6",
  "Room 5",
  "Room 4",
  "Room 3",
  "Room 2",
  "Room 8",
  "Room 9",
  "Room 10",
  "Room 11",
  "Room 12",
  "Room 13",
  "Room 14",
  "Room 18",
  "Room 17",
  "Room 16",
  "Room 15",
  "Room 19",
  "Room 23",
  "Room 22",
  "Room 21",
  "Room 20",
  "Le Bonheur de vivre",
  "Second Floor Balcony East (Room 24)",
  "Mezzanine",
  "Gallery Foyer",
  "Lower Lobby",
];

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
        const roomOrder = tourResponse.data.customRoomOrder.length
          ? tourResponse.data.customRoomOrder
          : DEFAULT_ROOM_ORDER;

        this.setState({
          title: tourResponse.data.title,
          objects: tourResponse.data.data.hits.hits,
          roomOrder: roomOrder,
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

  render() {
    const { tourId, title, roomOrder, objects } = this.state;

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
              objects={objects}
              sectionOrder={roomOrder}
            />
          </div>
        ) : (
          // Otherwise, no tour found for that id
          <div className="container tour-page-container">
            <p>Could not find tour with id "{tourId}"</p>
          </div>
        )}
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

const compWithRouter = withRouter(TourPage);
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(compWithRouter)
);
