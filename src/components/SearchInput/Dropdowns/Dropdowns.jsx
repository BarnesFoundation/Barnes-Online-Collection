import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { CSSTransitionGroup } from 'react-transition-group';
import Icon from '../../Icon';
import { ArtistSideMenu, ArtistSideMenuContent } from './ArtistSideMenu';
import { ClickTracker } from './ClickTracker';
import { YearInput } from './YearInput';
import { addAdvancedFilter, removeAdvancedFilter, setAdvancedFilters } from '../../../actions/filters';
import { BREAKPOINTS } from '../../../constants';
import searchAssets from '../../../searchAssets.json';
import './dropdowns.css';

// Setting up advanced filter names and dropdown menu items.
export const DROPDOWN_TERMS = {
    CULTURE: 'Culture',
    YEAR: 'Year',
    MEDIUM: 'Medium',
    LOCATION: 'Location',
    COPYRIGHT: 'Copyright',
    ARTIST: 'Artist',
};

const DROPDOWN_TERMS_ARRAY = [
    DROPDOWN_TERMS.CULTURE,
    DROPDOWN_TERMS.YEAR,
    DROPDOWN_TERMS.MEDIUM,
    DROPDOWN_TERMS.LOCATION,
    DROPDOWN_TERMS.COPYRIGHT,
    DROPDOWN_TERMS.ARTIST,
];

const DROPDOWN_TERMS_MAP = {
    [DROPDOWN_TERMS.CULTURE]: searchAssets.cultures,
    [DROPDOWN_TERMS.YEAR]: 'Lorem Ipsum', // TODO => populate this.
    [DROPDOWN_TERMS.MEDIUM]: searchAssets.mediums, // TODO => populate this.
    [DROPDOWN_TERMS.LOCATION]: Object.keys(searchAssets.locations).map(key => ({ key })), 
    [DROPDOWN_TERMS.COPYRIGHT]: Object.keys(searchAssets.copyrights).map(key => ({ key })),
    [DROPDOWN_TERMS.ARTIST]: searchAssets.artists,
};

/**
 * Formatted listed content for child of DropdownMenu or ArtistSideMenu.
 * @see getDropdownContent
 * */
const ListedContent = ({ data, activeTerms, pendingTerms = [], setActiveTerm, isArtists, isSideMenu }) => (
    <ul className='dropdown__list'>
        {data
            .filter(({ key }) => key) // Filter out null items.
            .map(({ key, doc_count }) => {
                // The following lines allow for toggling between applied and yet to be applied.
                const activeTermsHasKey = activeTerms.includes(key);
                const pendingTermsHasKey = pendingTerms.map(({ term }) => term).includes(key);
                const isActiveItem = (activeTermsHasKey && !pendingTermsHasKey) || (!activeTermsHasKey && pendingTermsHasKey);

                let listItemClassNames = 'dropdown__list-item';
                if (isActiveItem) listItemClassNames = `${listItemClassNames} ${listItemClassNames}--active`;

                // Apply special styling to icon so that is it adjacent to li for side menu only.
                let dropdownIconClassNames = 'dropdown__icon';
                if (isArtists && isSideMenu) dropdownIconClassNames = `${dropdownIconClassNames} dropdown__icon--artist`;

                return (
                    <li
                        key={key}
                        className={listItemClassNames}
                        onClick={() => setActiveTerm(key)}
                    >
                        <span>{key}</span>
                        {isArtists &&
                            <span className='side-menu__artist-doc-count'>
                                &nbsp;({doc_count})
                            </span>
                        }
                        {isActiveItem &&
                            <Icon
                                svgId='icon-checkmark'
                                classes={dropdownIconClassNames}
                            />
                        }
                    </li>
                );
            }
        )}
    </ul>
);

/** Actual dropdown menu. */
class DropdownMenu extends Component {
    constructor(props) {
        super(props);

        this.ref = null;
    }

    componentWillMount() {
        this.setState({});
    }

    render() {
        const { children, clear, headerText, topOffset, noScroll } = this.props

        const additionalStyle = topOffset ? { top: `${topOffset}px` } : {}; // This is to make sure mobile is correctly vertically aligned.
        
        let dropdownClassNames = 'dropdown';
        if (!noScroll) dropdownClassNames = `${dropdownClassNames} dropdown--scroll`;

        console.log(this.ref);

        return (
            <div
                className={`dropdowns-menu__dropdown ${dropdownClassNames}`}
                style={additionalStyle}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
            >
                <div
                    className='dropdown__header'
                    onClick={clear}
                >
                    {/** Both icons function the same, the first is an arrow for mobile, the second is an x for desktop. */}
                    <Icon
                        svgId='-icon_arrow_down'
                        classes='dropdown__icon dropdown__icon--back'
                    />
                    <span className='font-delta dropdown__header--text'>{headerText}</span>
                    <Icon
                        svgId='-icon_close'
                        classes='dropdown__icon dropdown__icon--x'
                    />
                </div>
                <div
                    ref={(ref) => {
                        // Ref will not be set on 1st render.
                        if (!this.ref) {
                            this.ref = ref;
                            this.forceUpdate();
                        }
                    }}
                    className='dropdown__content'
                >
                    {React.Children.map(children, (child) => (
                        React.cloneElement(child, { parentRef: this.ref })
                    ))}
                </div>
            </div>
        );
    }
}

/** Dropdown menu for filtering artwork. */
class DropdownSection extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            activeItem: null, // What dropdown is selected.
        };
    };

    /**
     * Set active index to item clicked, if this is already the active index then reset to null.
     * @param {string} index - index of clicked item.
     */
    setActiveItem(term) {
        const { activeItem } = this.state;
        const { setHasOverlay } = this.props; // Method from parent to lock scroll on search div.

        // If this is the current active item, reset to null.
        if (activeItem === term || term === null) {
            if (setHasOverlay) setHasOverlay(false);
            this.setState({ activeItem: null });
        } else {
            if (setHasOverlay) setHasOverlay(true);
            this.setState({ activeItem: term });
        }
    }

    /**
     * Add or remove selected term to filters.
     * @param {string} term - filter search term.
     * @param {boolean} mobile - if this is an apply filter manual or auto.
     */
    setActiveTerm = (term, isManualApply) => {
        const { activeItem } = this.state;
        const { pendingTerms, updatePendingTerms, activeTerms, addAdvancedFilter, removeAdvancedFilter } = this.props;

        // Create a filter to dispatch to redux store, this will be for the "Applied Filters" section.
        const filter = { filterType: activeItem, value: `${activeItem}: "${term}"`, term };

        // If this is for a manual application process, i.e. mobile.
        if (isManualApply) {
            if (pendingTerms.map(({ term: pTerm }) => pTerm).includes(term)) {
                updatePendingTerms(pendingTerms.filter(pendingTerm => pendingTerm.term !== term))
            } else {
                updatePendingTerms([...pendingTerms, filter]);
            }
        // If this is an automatic filter application process, i.e. desktop.
        } else {
            // If we are removing an item, filter it out of the array, otherwise append it to the array.
            if (activeTerms.includes(term)) {
                removeAdvancedFilter(filter);
            } else {
                addAdvancedFilter(filter);
            }
        }
    };

    /**
     * Get array of all new filters.
     * @returns {[object]} - array or filter objects.
     */
    getNewTerms = () => {
        const { pendingTerms, advancedFilters } = this.props;

        // Reduce existing redux store to flattened array of filter objects.
        const flattenedAdvancedFilters = Object.values(advancedFilters)
            .flatMap((advancedFilter) => Object.values(advancedFilter));


        // If a pending term is already in active terms, remove. Otherwise, it needs to be added to global state and active terms.
        return pendingTerms.reduce((acc, pendingTerm) => {
            const index = acc.findIndex(({ term }) => term === pendingTerm.term);

            // If index is located, remove item from array.
            if (index >= 0) {
                return [...acc.splice(0, index), ...acc.splice(index + 1, acc.length)];

            // If no index is found, append to array.
            } else {
                return [...acc, pendingTerm];
            }
        }, flattenedAdvancedFilters);
    }

    /**
     * Apply all pending terms to redux store.
     * This is only for mobile devices.
     */
    applyPendingTerms = () => {
        const { updatePendingTerms, setAdvancedFilters } = this.props;

        // If a pending term is already in active terms, remove. Otherwise, it needs to be added to global state and active terms.
        const newActiveTerms = this.getNewTerms()

        updatePendingTerms([]); // Reset parent state.
        setAdvancedFilters(newActiveTerms); // Update redux state for advanced filters.
    }

    /**
     * Get inner content for dropdown.
     * TODO => This generates a new element on every re-render, this should be a separate FC.
     * @param {string} term - name of clicked item.
     * @returns {JSX.Element} JSX to be rendered inside of Dropdown.
     */
    getDropdownContent = (term) => {
        const { activeItem } = this.state;
        const { pendingTerms, activeTerms, topOffset } = this.props;
        const data = DROPDOWN_TERMS_MAP[activeItem];
        
        // Props that are spread regardless of MediaQuery outcome.
        const listedContentSpreadProps = {
            data,
            activeTerms,
            pendingTerms,
        };

        switch (activeItem) {
            case (DROPDOWN_TERMS.ARTIST): {
                // Dropdown for artist should only be rendered for desktop devices.
                return <MediaQuery maxDeviceWidth={BREAKPOINTS.tablet_max}>
                    <DropdownMenu
                        headerText={term}
                        clear={() => this.setActiveItem(null)}
                        topOffset={topOffset}
                    >
                        {/** This will always behave in the manual application process. */}
                        <ArtistSideMenuContent
                            hasScroll
                            data={DROPDOWN_TERMS_MAP[DROPDOWN_TERMS.ARTIST]}
                            // Sort data inside of artistMenu component.
                            render={sortedData => (
                                <ListedContent
                                    {...listedContentSpreadProps}
                                    isArtists
                                    // Overwrite data from listedContentSpreadProps.
                                    data={sortedData}
                                    activeTerms={activeTerms}
                                    setActiveTerm={term => this.setActiveTerm(term, true)}
                                />
                            )}
                        />
                    </DropdownMenu>
                </MediaQuery>

            };
            case (DROPDOWN_TERMS.YEAR): {
                return (
                    <DropdownMenu
                        headerText={term}
                        clear={() => this.setActiveItem(null)}
                        noScroll
                        topOffset={topOffset}
                    >
                        <YearInput></YearInput>
                    </DropdownMenu>
                );
            };
            default: {
                return (
                    <DropdownMenu
                        headerText={term}
                        clear={() => this.setActiveItem(null)}
                        topOffset={topOffset}
                    >
                        {/** Mobile devices */}
                        <MediaQuery maxDeviceWidth={BREAKPOINTS.tablet_max}>
                            <ListedContent
                                {...listedContentSpreadProps}
                                setActiveTerm={term => this.setActiveTerm(term, true)}
                            />
                        </MediaQuery>
                        {/** Desktops */}
                        <MediaQuery minDeviceWidth={BREAKPOINTS.tablet_max + 1}>
                            <ListedContent
                                {...listedContentSpreadProps}
                                setActiveTerm={term => this.setActiveTerm(term, false)}
                            />
                        </MediaQuery>
                    </DropdownMenu>
                );
            }
        }
    };

    /**
     * On mount: 
     * 1) Set up reset function for HOC that keeps track of clicking out of dropdown. @see ClickTracker.jsx
     * 2) Set up function to apply pending terms in parent component. @see SearchInput.jsx
     * */
    componentDidMount() {
        const { setResetFunction, setApplyPendingTerms } = this.props;
        setResetFunction(() => this.setActiveItem(null));
        setApplyPendingTerms(this.applyPendingTerms)
    }

    render() {
        const { activeItem } = this.state;
        const { activeTerms } = this.props;

        // Get count of each type of filter about to be appplied for superscript in dropdown button.
        const advancedFilterObject = this.getNewTerms()
            .reduce((acc, advancedFilter) => ({
                ...acc, [advancedFilter.filterType]: acc[advancedFilter.filterType] ? acc[advancedFilter.filterType] + 1 : 1
            }), {});
        
        return (
            <div className='dropdowns-menu'>
                {DROPDOWN_TERMS_ARRAY.map((term, i) => {
                    const isLastDropdown = i === DROPDOWN_TERMS_ARRAY.length - 1;
                    const isActiveItem = activeItem === term;

                    // If this is the last item, we want to remove the chevron and add a | before the item.
                    let buttonClassName = 'dropdowns-menu__button';
                    if (isLastDropdown) buttonClassName = `${buttonClassName} dropdowns-menu__button--last`;

                    // If this is the active item, we want to flip the chevron.
                    let iconClassName = 'dropdowns-menu__icon';
                    if (isActiveItem) iconClassName = `${iconClassName} dropdowns-menu__icon--active`;
                    if (isLastDropdown) iconClassName = `${iconClassName} dropdowns-menu__icon--last`;
                    
                    return (
                        <div key={term} className='dropdowns-menu__button-wrapper'>
                            <button
                                key={term}
                                className={buttonClassName}
                                onClick={() => this.setActiveItem(term)}
                            >
                                <span className='dropdowns-menu__button-content'>
                                    {term}
                                    <sup className='dropdowns-menu__button-sup'>&nbsp;{advancedFilterObject[term]}</sup>
                                </span>
                                <Icon svgId='-icon_arrow_down' classes={iconClassName} />
                            </button>
                            {/** Have transition for mobile devices. */}
                            <MediaQuery maxDeviceWidth={BREAKPOINTS.tablet_max}>
                                <CSSTransitionGroup
                                    transitionName='dropdown-slide'
                                    transitionEnterTimeout={350}
                                    transitionLeaveTimeout={350}
                                >
                                    {isActiveItem && this.getDropdownContent(term)}
                                </CSSTransitionGroup>
                            </MediaQuery>

                            {/** Just render w/o animation for desktop. */}
                            <MediaQuery minDeviceWidth={BREAKPOINTS.tablet_max + 1}>
                                {isActiveItem && this.getDropdownContent(term)}
                            </MediaQuery>
                        </div>
                    );
                })}
                
                <MediaQuery minDeviceWidth={BREAKPOINTS.tablet_max + 1}>
                    <ArtistSideMenu
                        isOpen={activeItem === DROPDOWN_TERMS.ARTIST}
                        closeMenu={() => this.setActiveItem(null)}
                    >
                        <ArtistSideMenuContent
                            data={DROPDOWN_TERMS_MAP[DROPDOWN_TERMS.ARTIST]}
                            // Sort data inside of artistMenu component.
                            render={sortedData => (
                                <ListedContent
                                    isArtists
                                    isSideMenu
                                    data={sortedData}
                                    activeTerms={activeTerms}
                                    setActiveTerm={this.setActiveTerm}
                                />
                            )}
                        />
                    </ArtistSideMenu>
                </MediaQuery>
            </div>
        )
    }
};

const mapStateToProps = state => ({
    advancedFilters: state.filters.advancedFilters,
    activeTerms: Object.values(state.filters.advancedFilters) // Go over every key in advanced filter.
        .flatMap((value) => (Object.values(value)).map(({ term }) => term)) // Go through every object value and get the term, flatMap into single array.
});
const mapDispatchToProps = dispatch => bindActionCreators(Object.assign({}, { addAdvancedFilter, removeAdvancedFilter, setAdvancedFilters }), dispatch);
const ConnectedDropdownSection = connect(mapStateToProps, mapDispatchToProps)(DropdownSection);

// Wrap component in HOC that keeps track if a user has clicked out.
const WrappedAndConnectedDropdownSection = ({ ...props }) => (
    <ClickTracker {...props}>
        <ConnectedDropdownSection />
    </ClickTracker>
);

export { WrappedAndConnectedDropdownSection as Dropdowns }