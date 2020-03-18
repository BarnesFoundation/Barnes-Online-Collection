import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from 'axios';
import { ClickTracker } from './Dropdowns/ClickTracker';
import { DROPDOWN_TERMS } from './Dropdowns/Dropdowns';
import { addAdvancedFilter } from '../../actions/filters';
import { MAIN_WEBSITE_DOMAIN } from '../../constants';

class Suggestions extends Component {
	constructor(props) {
		super(props);

		this.ref = null;

		this.state = {
			resultsLength: 0, // Falsy if the autosuggest has not been truncated.
			isMeasured: false,
		}
	}

	/**
	 * Check if autoSuggestResults has updated.
	 * This needs to act in the following order:
	 * 1) state.isMeasured is false, this moves the rendered content off screen.
	 * 2) After checking that isMeasured has been set to false, retrigger ref action.
	 * */
	componentDidUpdate(prevProps) {
		// 1) Move content off screen and rerender.
		if (JSON.stringify(prevProps.autoSuggestResults) !== JSON.stringify(this.props.autoSuggestResults)) {
			this.setState({ isMeasured: false });
		}

		// 2) Retrigger ref action after rerender from 1.
		if (this.state.isMeasured === false) {
			this.setSuggestionCount();
		}
	}

	/**
	 * Set up ref for measuring results length.
	 * @param {React.ref} ref - ref to be set.
	 */
	setRef = (ref) => {
		// If this ref has not been set.
		if (!this.ref) {
			this.ref = ref; // Set ref.

			// Call method to set number of suggestions.
			this.setSuggestionCount();
		}
	};

	/**
	 * Get number of suggestions according to window height.
	 */
	setSuggestionCount = () => {
		if (this.ref) {
			// Calculate max size of suggestions dropdown.
			const { top } = this.ref.getBoundingClientRect();
			const maxHeight = window.innerHeight - (top + 60); // 60px additional padding, just to prevent any overflow.

			// Get count of how many items should be rendered.
			const { resultsLength } = [...this.ref.children] // Convert HTMLCollection to iterable array.
				.slice(0, this.ref.children.length - 1) // Cut off "All search results" child.
				.reduce(({ resultsLength, maxHeight }, child) => {
					const { height } = child.getBoundingClientRect();

					// If this can fit on screen, increment counter and decrease maxHeight measurement.
					if (maxHeight - height > 0) {
						return ({
							resultsLength: resultsLength + 1,
							maxHeight: maxHeight - height,
						});
					} else {
						// Otherwise, return unaltered accumulator.
						return { resultsLength, maxHeight: maxHeight - height };
					}
				}, { resultsLength: 0, maxHeight });

			this.setState({
				resultsLength,
				isMeasured: true,
			});
		}
	}

	render() {
		const { resultsLength, isMeasured } = this.state; // Will always be 1+.
		const { autoSuggestResults } = this.props;

		const results = [
			...autoSuggestResults.slice(0, isMeasured ? resultsLength - 1 : autoSuggestResults.length),
			...autoSuggestResults.slice(-1),
		];

		return (
			<div
				className='suggestions'
				style={{ left: isMeasured ? 0 : 9999 }}
				ref={this.setRef}
			>
				{results.map(({ suggestionText, href, onClick }, i) => {
					return (
						<a
							key={`${suggestionText}${href}${i}`}
							className='m-search-suggestion'
							href={href}
							onClick={onClick}
							dangerouslySetInnerHTML={{ __html: suggestionText }}
						>
						</a>
					);
				})}
			</div>
		)
	}
}

const MINIMUM_WAIT = 1000;

/**
 * Controlled input component w/ search on enter.
 */
class SearchBar extends Component {
    constructor(props) {
        super(props);

		this.ref = null;

        this.state = {
			// For controlled input component
            value: '',
			isFocused: true,
			
			// For autosuggest
			autoSuggestResults: [],
		};

		// None of these variables need to necessarily be state properties as they do not trigger rendering of the component or any children.
		this.searchedQuery = '';
		
		this.minimumTimeout = null; // For timeouts that are cleared in cDU.
		this.maximumTimeout = null;

		this.firstInputOcurred = false;
    }

    /**
     * If enter key is pressed and search is focused, execute search.
     */
    searchOnEnter = (e) => {
		const { isFocused, value } = this.state;

        if (e.key === 'Enter' && isFocused && value) this.enter();
    };

    /**
     * Add event listener for pressing enter on mount.
     */
	componentDidMount() {
		window.addEventListener('keydown', this.searchOnEnter);
	}
	
	/**
	 * Cleanup event listener and remove any standing stos on unmount.
	 */
    componentWillUnmount() {
		window.removeEventListener('keydown', this.searchOnEnter);

		// Clean up timeouts from suggestion.
		if (this.minimumTimeout) clearTimeout(this.minimumTimeout);
		if (this.maximumTimeout) clearTimeout(this.maximumTimeout);
	}

	/**
	 * Set focus of input.
	 * @param {boolean} isFocused - If input is currently focused.
	 */
	setFocus = isFocused => this.setState({ isFocused }); // Set focus

	/**
	 * onChange Handler for controlled input.
	 * @param {SyntheticEvent} - event passed from input onChange.
	 */
	onChange = ({ target: { value } }) => {
		const { autoSuggest, updateFilters } = this.props;

		this.setState({ value });

		// For auto-suggest functionality
		if (autoSuggest) {
			this.autoSuggest();
		}

		if (updateFilters) {
			updateFilters(value);
		}
	} 
	
	/**
	 * 
	 */
	autoSuggest = () => {
		// Clear the previous timeout
		clearTimeout(this.minimumTimeout);

		// Set delay for suggestion to minimumWait from now
		this.minimumTimeout = setTimeout(() => {
			// console.log('I'll execute the min suggest now');
			this.execAutoSuggest();
		}, MINIMUM_WAIT);

		// Set delay for suggestion to occur maximumWait from out
		if (this.firstInputOcurred === false) {
			this.firstInputOcurred = true;

			this.maximumTimeout = setTimeout(() => {
				// console.log('I'll execute the max suggest now');
				this.execAutoSuggest();
			}, MINIMUM_WAIT);
		}
	}

	/**
	 * Send autosuggest query to server and setState with results + "All search results for tail".
	 */
	execAutoSuggest = async () => {
		const { isCollectionAdvancedSearch, addAdvancedFilter, submit } = this.props;

		// Get the query, suggestion area, and search current query
		const query = this.state.value
		this.searchedQuery = query;

		// If the query becomes blank, remove the suggestions and reset firstInputOcurred
		if (query.trim().length === 0) {
			this.firstInputOcurred = false;
			this.setState({ autoSuggestResults: [] });
		}

		// Otherwise, do suggestion logic
		else if (query.trim().length > 0) {
			const results = (await axios(
				isCollectionAdvancedSearch
					? `/api/advancedSearchSuggest?q=${query}`
					: `/api/suggest?q=${query}`
			)).data;
			
			// Only append results that we're launced for the current query
			if (this.searchedQuery === query) {
				// If this is for the advanced collection search.

				let autoSuggestResults; // Array which will hold our suggestion items.
				// If this is a collection advanced search
				if (isCollectionAdvancedSearch) {
					const { collectionAdvancedSearch } = results;

					// For people from advanced search.
					// This will only dispatch actions rather than provide an href.
					autoSuggestResults = [
						...collectionAdvancedSearch.map((result) => {
							const artist = result.key;
							const artCount = result.doc_count;
							const suggestionText = `See all artworks by ${artist} (${artCount})`;
							const onClick = () => {
								// Dispatch to redux and unfocus to close dropdown.
								addAdvancedFilter({ filterType: DROPDOWN_TERMS.ARTIST, value: result.raw, term: result.raw });
								this.setFocus(false);
							};

							return { suggestionText, onClick };
						}),

						{
							suggestionText: `<svg class="m-search-suggestion__icon" width="26" height="26"><use xlink:href="#icon--icon_search"></use>s</svg><span class="m-search-suggestion__search-all">All search results for "${query}"</span>`,
							onClick: () => {
								submit(query);
								this.setFocus(false);
							}
						},
					]
				} else {
					const { entryResults, collectionResults } = results;

					autoSuggestResults = [
						// For people.
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

						{
							suggestionText: `<svg class="m-search-suggestion__icon" width="26" height="26"><use xlink:href="#icon--icon_search"></use>s</svg><span class="m-search-suggestion__search-all">All search results for "${query}"</span>`,
							href: `${MAIN_WEBSITE_DOMAIN}/search?q=${query}`,
						},
					]
				}

				this.setState({ autoSuggestResults });
			}
		}
	}

    /**
     * Submit search.
     * @param {SyntheticEvent?} - optional event, depending if this was from button or from enter press.
     */
    enter = (e) => {
		const { submit } = this.props;
		const { value } = this.state;

		// Prevent default onClick.
        if (e) e.preventDefault();

		if (value) {
			this.setState({ value: '' });
			submit(value); // Submit from parent.
		}
    }

    render() {
        const { autoSuggest, className, placeholder, onFocus } = this.props;
		const { autoSuggestResults, value, isFocused } = this.state;

        let searchClassName = 'search__searchbar';
        if (className) searchClassName = `search__searchbar ${className}`;

        return (
			<div className={searchClassName}>
                <div className='search__input-group'>
                    <div className='font-zeta search__header'>SEARCH COLLECTION</div>
					<ClickTracker resetFunction={() => this.setFocus(false)}>
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
						/>
						{Boolean(autoSuggest && autoSuggestResults.length && isFocused) &&
							<Suggestions
								autoSuggestResults={autoSuggestResults}
								value={value}
							/>
						}
					</ClickTracker>
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

const mapDispatchToProps = dispatch => bindActionCreators(Object.assign({}, { addAdvancedFilter }), dispatch);
const ConnectedSearchBar = connect(null, mapDispatchToProps)(SearchBar);
export { ConnectedSearchBar as SearchBar };
