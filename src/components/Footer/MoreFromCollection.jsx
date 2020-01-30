import React from 'react';

// TODO => Delete this, this is for testing layout.
const MOCK_OBJECT = {
    title: 'Lorem Ipsum',
    label: 'Permanent Collection',
    backgroundImage: 'https://barnesfoundation-collection.imgix.net/5112_U7ZsFncZX0Jq7Xw3_n.jpg',
    dateField: 'Ongoing',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
};
const MOCK_OBJECTS = [...Array(3)].map(() => MOCK_OBJECT);

/**
 * Convert object details to JSX card.
 * @param {object} param - Event/More from Collection detail.
 * @returns {JSX.Element} - Event/More from Collection JSX card.
 */
const MoreFromCollectionCard = ({ moreFromDetail: { title, label, backgroundImage, dateField, description }}) => (
    <div className='m-card-event vevent'>
        <div className='m-card-event__header'>
            <a className='m-card-event__media-link' href='/'>
                <img
                    className='m-card-event__media'
                    src={backgroundImage}
                />
            </a>
        </div>
        <div className='m-card-event__body'>
            <div className='font-zeta m-card-event__type'>{label}</div>
            <h3 className='font-delta m-card-event__title'>
                <a href='/'>
                    {title}
                </a>
            </h3>
            <div className='dtstart font-delta m-card-event__date'>
                {dateField}
            </div>
            <div className='summary m-card-event__summary'>
                <p>{description}</p>
            </div>
        </div>
    </div>
);

/**
 * More from collection section.
 * @param {object[]} moreFromDetails - Array of Event/More from Collection detail objects.
 * @returns {React.FC} - React functional component for "More from collection" section.
 */
export const MoreFromCollection = ({ moreFromDetails }) => {

    // TODO => The details for this will eventually be passed.
    return (
        <div className='container'>
            <div className='m-block'>
                <h2 className='font-beta m-block__title'>More from the collection</h2>
                <div className='m-card-event-list'>
                    {(moreFromDetails || MOCK_OBJECTS).map((moreFromDetail, i) => <MoreFromCollectionCard key={i} moreFromDetail={moreFromDetail}/>)}
                </div>
            </div>
        </div>
    );
}

