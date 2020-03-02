import React, { Component } from 'react';
import Icon from '../Icon';
import axios from 'axios';

/**
 * Controlled input component w/ search on enter.
 */
export class SearchBar extends Component {
    constructor(props) {
        super(props);

		this.ref = null;
		
        this.state = {
            value: '',
			isFocused: true,
			
			autoSuggestResults: [],
		};
    }

    /**
     * If enter key is pressed and search is focused, execute search.
     */
    searchOnEnter = (e) => {
        if (e.key === 'Enter' && this.state.isFocused) this.enter();
    };

    /**
     * Add event listener for pressing enter on mount and cleanup event listener on unmount.
     */
    componentDidMount() { window.addEventListener('keydown', this.searchOnEnter); }
    componentWillUnmount() {
		window.removeEventListener('keydown', this.searchOnEnter);

		// Clean up timeouts from suggestion.
		if (this.minimumTimeout) clearTimeout(this.minimumTimeout);
		if (this.maximumTimeout) clearTimeout(this.maximumTimeout);
	}

	setFocus = isFocused => this.setState({ isFocused }); // Set focus

	// For controlled component.
	onChange = ({ target: { value } }) => {
		this.setState({ value });

		// For auto-suggest functionality
		if (this.props.autoSuggest) {
			this.autoSuggest();
		}
	 } 

	searchedQuery = '';
	minimumWait = 1000;
	// maximumWait = 8000;

	minimumTimeout;
	maximumTimeout;
	firstInputOcurred = null;
		
	autoSuggest = () => {

		// Clear the previous timeout
		clearTimeout(this.minimumTimeout);

		// Set delay for suggestion to minimumWait from now
		this.minimumTimeout = setTimeout(() => {
			// console.log('I'll execute the min suggest now');
			this.execAutoSuggest();
		}, this.minimumWait);

		// Set delay for suggestion to occur maximumWait from out
		if (this.firstInputOcurred == null) {
			this.firstInputOcurred = true;

			this.maximumTimeout = setTimeout(() => {
				// console.log('I'll execute the max suggest now');
				this.execAutoSuggest();
			}, this.minimumWait);
		}
	}

	execAutoSuggest = async () => {
		
		// Get the query, suggestion area, and search current query
		const query = this.state.value
		this.searchedQuery = query;

		// If the query becomes blank, remove the suggestions and reset firstInputOcurred
		if (query.trim().length === 0) {
			this.firstInputOcurred = null;
			this.setState({ autoSuggestResults: [] });
		}

		// Otherwise, do suggestion logic
		else if (query.trim().length > 0) {
			const results = (await axios(`api/suggest?q=${query}`)).data;

			// Only append results that we're launced for the current query
			if (this.searchedQuery === query && this.ref) {
				const { entryResults, collectionResults } = results;

				// Calculate how many suggestions should appear on screen.
				const { top, height } = this.ref.getBoundingClientRect();
				const maxSuggestions = (window.innerHeight - (top + height))/100; // TODO => This is a rough figure and should be calculated.

				this.setState({
					autoSuggestResults: [
						...[
							// For artists.
							...collectionResults.people.map((result) => {
								const artist = result.key;
								const artCount = result.doc_count;
								const suggestionText = `See all artworks by ${artist} (${artCount})`;
								const href = `${result.url}${JSON.stringify(result.query)}`;

								return { suggestionText, href };
							}),

							// For entries.
							...entryResults.map((entry) => {
								const suggestionText = `${entry.title} (${entry.type})`;
								const href = entry.url;

								return { suggestionText, href };
							}),
						].slice(0, maxSuggestions),

						// Display the "All search results for" item.
						{
							suggestionText: `<svg class="m-search-suggestion__icon" width="26" height="26"><use xlink:href="#icon--icon_search"></use>s</svg><span class="m-search-suggestion__search-all">All search results for "${query}"</span>`,
							href: `/search?q=${query}`,
							isLast: true,
						},
					]
				});
			}
		}
	}

    /**
     * Submit search.
     * @param {SyntheticEvent?} - optional event, depending if this was from button or from enter press.
     */
    enter = (e) => {
        if (e) e.preventDefault();

        this.props.submit(this.state.value); // Submit from parent.
        this.setState({ value: '' });
    }

    render() {
        const { autoSuggest, hasTooltip, className, placeholder, onFocus } = this.props;
		const { autoSuggestResults } = this.state;

        let searchClassName = 'search__searchbar';
        if (className) searchClassName = `search__searchbar ${className}`;

        return (
			<div
				className={searchClassName}
				ref={ref => this.ref = ref}
			>
                <div className='search__input-group'>
                    <div className='font-zeta search__header'>SEARCH COLLECTION</div>
                    <input
                        className='search__input'
                        type='text'
                        value={this.state.value}
                        placeholder={placeholder || 'Search'}
                        onChange={this.onChange}
                        onFocus={() => {
                            this.setFocus(true); // Set focus state for this component.

                            if (onFocus) onFocus(); // If there is an onfocus prop from parent, pass it here.
                        }}
                        onBlur={() => this.setFocus(false)}
                    />
                    {hasTooltip &&
                        <div className='search-information'>
                            <Icon svgId='-icon-information' classes='search-information__icon' />
                            <div className='font-chapo search-information__tooltip'>
                                <Icon
                                    svgId='-icon_close'
                                    classes='search-information__icon search-information__icon--x'
                                />
                                <span>Find exactly what you're looking for in our collection by searching for artist, accession number, object description, bibliography, provenance, exhibitions, or history</span>
                            </div>
                        </div>
                    }
					{Boolean(autoSuggest && autoSuggestResults.length) &&
						<div
							id='suggestions'
						>
							{autoSuggestResults.map(({ suggestionText, href }) => {

								return (
									<a
										key={`${suggestionText}${href}`}
										className='m-search-suggestion'
										href={href}
										dangerouslySetInnerHTML={{ __html: suggestionText }}
									>
									</a>
								);
							})}
						</div>
					}
                </div>
                <button
                    className='btn btn--primary search__button'
                    type='submit'
                    onClick={this.enter}
                >
                    Search
                </button>
            </div>
        )
    }
}


// Display the artists
// for (let i = 0; i < collectionResults.people.length; i++) {
// 	const artist = collectionResults.people[i].key;
// 	const artCount = collectionResults.people[i].doc_count;
// 	const suggestionText = `See all artworks by ${artist} (${artCount})`;

// 	// const aNode = document.createElement('a');
// 	// aNode.classList.add('m-search-suggestion');
// 	// aNode.innerHTML = suggestionText;
// 	const href = collectionResults.people[i].url + JSON.stringify(collectionResults.people[i].query);
// 	// suggestionArea.appendChild(aNode);

// 	// console.log(`${suggestionText} ${href}`);
// }

// Display the entry results
// for (let j = 0; j < entryResults.length; j++) {
// 	const entry = entryResults[j];
// 	const suggestionText = `${entry.title} (${entry.type})`;

// 	//const aNode = document.createElement('a');
// 	//aNode.classList.add(...['m-search-suggestion']);
// 	//aNode.innerHTML = suggestionText;
// 	const href = `${entry.url}`;
// 	// suggestionArea.appendChild(aNode);

// 	console.log(`${suggestionText} ${href}`);
// }

// Display the "All search results for" item
//const aNode = document.createElement('a');
//aNode.classList.add(...['m-search-suggestion', 'last']);
//aNode.innerHTML =
//`<svg width='26' height='26'><use xlink:href='#icon--icon_search'></use>s</svg>All search results for '${query}'`;
//aNode.href = `/search?q=${query}`;
//suggestionArea.appendChild(aNode);