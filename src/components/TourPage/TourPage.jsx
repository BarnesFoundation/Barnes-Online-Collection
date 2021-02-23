import React from 'react';
import axios from 'axios';

export class TourPage extends React.Component {

	constructor() {
		super();

		this.state = {
			tourId: null,
			tour: null
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
					tour: tourResponse.data
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

		const { tourId, tour } = this.state;

		return (
			<div className="app app-tour-page">
				{(tourId && tour)
					? // Display the tour if it was located
					<div>
						<p>Displaying the {tourId} tour</p>
						<p>{JSON.stringify(tour)}</p>
					</div>

					: // Otherwise, no tour found for that id
					<div>
						<p>Could not find tour with id "{tourId}"</p>
					</div>
				}

			</div>
		);
	};
};