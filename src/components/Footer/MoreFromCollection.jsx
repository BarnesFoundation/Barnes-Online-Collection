import React from 'react';
import axios from 'axios';
import { MAIN_WEBSITE_DOMAIN } from '../../constants';

const IMGIX_ROOT = 'http://barnesfoundation.imgix.net';
const IMGIX_PARAMS = '?crop=faces&fit=crop&fm=pjpg&fp-x=0.5&fp-y=0.5&h=300&ixlib=php-2.1.1&w=406';

/**
 * Convert object details to JSX card.
 * @param {object} param - Event/More from Collection detail.
 * @returns {JSX.Element} - Event/More from Collection JSX card.
 */
const MoreFromCollectionCard = ({ moreFromDetail: { title, label, backgroundImage, date, description, customSlug } }) => {
	const entryUrl = `${MAIN_WEBSITE_DOMAIN}/${customSlug}`;
	const imgixUrl = `${IMGIX_ROOT}${backgroundImage.substring(backgroundImage.indexOf('/assets'))}${IMGIX_PARAMS}`;

	return (
		<div className='m-card-event vevent'>
			<div className='m-card-event__header'>
				<a className='m-card-event__media-link' href={entryUrl}>
					<img
						alt={title}
						className='m-card-event__media'
						src={imgixUrl}
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
 * @returns {() => Promise<object>} - async closure with scoped fetching function and stateful entries.
 */
const getEntries = (() => {
    const data = { value: null };
    const fetchData = async () => {
        data.value = (await axios({ url: '/api/entries' })).data;
        return data.value;
    };

    return async () => data.value || await fetchData();
})();

/**
 * More from collection section.
 * @param {object[]} moreFromDetails - Array of Event/More from Collection detail objects.
 */
export class MoreFromCollection extends React.Component {
	constructor(props) {
		super(props);

		this.ref = { current: null };

		this.state = {
			entries: [],
		};
	}

	/** Set ref after 1st render and check ref after async action.  This prevents setState on unmounted component. */
	setRef = async (ref) => {
		if (this.ref) {
			this.ref = ref;

			try {
				const entries = await getEntries();
				this.setState({ entries });
			} catch (e) {
				this.setState({ entries: [] });
			}
		}
	}

	// TODO => The details for this will eventually be passed.
	render() {

		const { entries } = this.state;

		return (
			<div
				ref={this.setRef}
				className='container'
			>
				{Boolean (entries && entries.length) &&
					<div className='m-block'>
						<h2 className='font-beta m-block__title'>More from the collection</h2>
						<div className='m-card-event-list'>
							{(entries).map((entry, i) => <MoreFromCollectionCard key={i} moreFromDetail={entry} />)}
						</div>
					</div>
				}
			</div>
		);

	}
}

