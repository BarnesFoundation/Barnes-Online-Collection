import React from 'react';
import axios from 'axios';
import { MAIN_WEBSITE_DOMAIN } from '../../constants';

/**
 * Convert object details to JSX card.
 * @param {object} param - Event/More from Collection detail.
 * @returns {JSX.Element} - Event/More from Collection JSX card.
 */
const MoreFromCollectionCard = ({ moreFromDetail: { title, label, backgroundImage, date, description, customSlug } }) => {
	const entryUrl = `${MAIN_WEBSITE_DOMAIN}/${customSlug}`;
	return (
		<div className='m-card-event vevent'>
			<div className='m-card-event__header'>
				<a className='m-card-event__media-link' href={entryUrl}>
					<img
						className='m-card-event__media'
						src={backgroundImage}
					/>
				</a>
			</div>
			<div className='m-card-event__body'>
				<div className='font-zeta m-card-event__type'>{label}</div>
				<h3 className='font-delta m-card-event__title'>
					<a href={entryUrl}>
						{title}
					</a>
				</h3>
				<div className='dtstart font-delta m-card-event__date'>
					{date}
				</div>
				<div className='summary m-card-event__summary'>
					<p dangerouslySetInnerHTML={{ __html: description }}></p>
				</div>
			</div>
		</div>
	)
};

/**
 * Memoize initial response of entries from server.
 * @returns {() => Promise<object>} - closure with scoped fetching function and stateful entries.
 */
const getEntries = (() => {
    const data = { value: null };
    const fetchData = async () => {
        data.value = (await axios({ url: '/api/entries' })).data;
        return data.value;
    };

    return async () => (data.value || await fetchData());
})();

/**
 * More from collection section.
 * @param {object[]} moreFromDetails - Array of Event/More from Collection detail objects.
 * @returns {any} - React functional component for "More from collection" section.
 */
export class MoreFromCollection extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	async componentDidMount() {
		const entries = await getEntries();
		this.setState({ entries });
	}

	// TODO => The details for this will eventually be passed.
	render() {

		const { entries } = this.state;

		if (entries) {
			return (
				<div className='container'>
					<div className='m-block'>
						<h2 className='font-beta m-block__title'>More from the collection</h2>
						<div className='m-card-event-list'>
							{(entries).map((entry, i) => <MoreFromCollectionCard key={i} moreFromDetail={entry} />)}
						</div>
					</div>
				</div>
			);
		}
		return <div></div>
	}
}

