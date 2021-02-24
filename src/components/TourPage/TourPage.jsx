import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ObjectActions from '../../actions/object';
import { SiteHeader } from '../../components/SiteHeader/SiteHeader';
import SiteHtmlHelmetHead from '../SiteHtmlHelmetHead';
import HtmlClassManager from '../HtmlClassManager';
import StickyList from '../StickyList/StickyList';
import './tourPage.css'

class TourPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			tourId: null,
			title: null,
      objects: null,
      roomOrder: null,
		};
	};

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
          roomOrder: tourResponse.data.customRoomOrder
				});
			}

			catch (error) {
				console.log(`An error occurred retrieving the tour for id ${id}`, error);
			}

			finally {
				this.setState({
					...this.state,
					tourId: id
				})
			}
		}
	};

	render() {
		const { tourId, title, objects } = this.state;

    const header = <div className="tour-page-hero"><img src='https://d2r83x5xt28klo.cloudfront.net/6814_mpfCoboPefnN6Ws6_n.jpg' style={{"width": "100%", "margin-top": "-150px"}} /><h2 className="tour-title">{title}</h2></div>

		return (
			<div className="app app-tour-page">
        <SiteHtmlHelmetHead />
        <HtmlClassManager />
        <SiteHeader isTour />
        {(tourId && title && objects)
          ? // Display the tour if it was located
            <div className="tour-page-container">
              <StickyList title={title} />
            </div>
          : // Otherwise, no tour found for that id
            <div className="container tour-page-container">
              <p>Could not find tour with id "{tourId}"</p>
            </div>
        }
			</div>
		);
	};
};

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

const compWithRouter = withRouter(TourPage);
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(compWithRouter));
