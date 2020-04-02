import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
// import { CSSTransitionGroup } from 'react-transition-group';
import Icon from '../../Icon';
import { ArtistSideMenu, ArtistSideMenuContent } from './ArtistSideMenu';
import { ClickTracker } from './ClickTracker';
import { YearInput } from './YearInput';
import { addAdvancedFilter, removeAdvancedFilter, setAdvancedFilters } from '../../../actions/filters';
import { toggleArtistMenu } from '../../../actions/filterSets';
import { BREAKPOINTS } from '../../../constants';
import { getSearchAssets } from '../../../searchAssets';
import './dropdowns.css';

// Setting up advanced filter names and dropdown menu items.
export const DROPDOWN_TERMS = {
    CULTURE: 'Culture',
    YEAR: 'Year',
    CATEGORY: 'Category',
    ROOM: 'Room',
    COPYRIGHT: 'Copyright',
    ARTIST: 'Artist',
};

const DROPDOWN_TERMS_ARRAY = [
    DROPDOWN_TERMS.CULTURE,
    DROPDOWN_TERMS.YEAR,
    DROPDOWN_TERMS.CATEGORY,
    DROPDOWN_TERMS.ROOM,
    DROPDOWN_TERMS.COPYRIGHT,
    DROPDOWN_TERMS.ARTIST,
];

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

        // This ref and subsequent state are to calculate the height of the dropdown__content.
        // This is because on iOS, when you dynamically add content to a div with -webkit-overflow-scrolling: touch; that exceeds
        // the div in height, it becomes broken and unscrollable.
        this.heightRef = null;
        this.state = { refHeight: 1 };

        // Outer ref that is actually scrolled for quickscroll.
        this.scrollRef = null;
    }

    /**
     * Set up ref to calculate dropdown__content height.
     */
    setHeightRef = (ref) => {
        if (!this.heightRef) {
            this.heightRef = ref;

            // For re-render after ref has been set.
            this.setState({ refHeight: ref.children[0].offsetHeight + 10 });
        }
    }

    /** Set up scroll ref. */
    setScrollRef = (ref) => {
        if (!this.scrollRef) {
            this.scrollRef = ref;

            // Force re-render as ref may not be set on first render.
            this.forceUpdate();
        }
    }

    render() {
        const { refHeight } = this.state;
        const { children, clear, headerText, topOffset, noScroll, hasQuickScroll } = this.props

        let additionalStyle = {}; // This is to make sure mobile is correctly vertically aligned.
        if (topOffset) additionalStyle = { top: `${topOffset}px` };
        if (!noScroll) additionalStyle = { ...additionalStyle, scroll: `hidden` };

        let dropdownClassNames = 'dropdown';
        if (!noScroll) dropdownClassNames = `${dropdownClassNames} dropdown--scroll`;

        return (
            <div
                className={`${dropdownClassNames}`}
                style={{
                    ...additionalStyle,
                }}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
            >
                {/** Both icons function the same, the first is an arrow for mobile, the second is an x for desktop. */}
                <div
                    className='dropdown__header'
                    onClick={clear}
                >
                    <Icon
                        svgId='-icon_arrow_down'
                        classes='dropdown__icon dropdown__icon--back'
                    />
                    <span className='font-delta dropdown__header-text'>{headerText}</span>
                    <Icon
                        svgId='-icon_close'
                        classes='dropdown__icon dropdown__icon--x'
                    />
                </div>
                {hasQuickScroll &&
                    <div className='dropdown__quick-scroll quick-scroll'>
                        <Icon
                            svgId='-icon_arrow_down'
                            classes='quick-scroll__icon quick-scroll__icon--up'
                            onClick={() => {
                                if (this.scrollRef) this.scrollRef.scrollTo(0, this.scrollRef.scrollTop - 500);
                                if (this.heightRef) this.heightRef.scrollTo(0, this.heightRef.scrollTop - 500);
                            }}
                        />
                        <Icon
                            svgId='-icon_arrow_down'
                            classes='quick-scroll__icon quick-scroll__icon--down'
                            onClick={() => {
                                if (this.scrollRef) this.scrollRef.scrollTo(0, this.scrollRef.scrollTop + 500);
                                if (this.heightRef) this.heightRef.scrollTo(0, this.heightRef.scrollTop + 500);
                            }}
                        />
                    </div>
                }
                <div
                    className='dropdown__body-wrapper'
                    ref={this.setScrollRef}
                >
                    <div
                        className='dropdown__content'
                        ref={this.setHeightRef}
                        style={{
                            minHeight: `calc(100% + 1px)`,
                            height: `calc(100% + ${refHeight}px - 50vh + 60px)`,
                        }}
                    >
                        {children}
                    </div>
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
            dropdownTermsMap: null,
        };
    };

    /**
     * Set active index to item clicked, if this is already the active index then reset to null.
     * @param {string} index - index of clicked item.
     */
    setActiveItem(term) {
        const { activeItem } = this.state;
        const { setHasOverlay, toggleArtistMenu } = this.props; // Method from parent to lock scroll on search div.

        // If this is an artist menu, we will want to alter the redux store.
        if (activeItem === DROPDOWN_TERMS.ARTIST || term === DROPDOWN_TERMS.ARTIST) toggleArtistMenu(term === DROPDOWN_TERMS.ARTIST);

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
        const { activeItem, dropdownTermsMap } = this.state;
        const { pendingTerms, updatePendingTerms, activeTerms, addAdvancedFilter, removeAdvancedFilter } = this.props;
        
        let filter;
        switch(activeItem) {
        
            case DROPDOWN_TERMS.YEAR: 
                filter = {
                    filterType: DROPDOWN_TERMS.YEAR,
                    value: term.formattedYearsString,
                    term
                };
                break;

            case DROPDOWN_TERMS.COPYRIGHT:
            case DROPDOWN_TERMS.ROOM: 
                filter = {
                    filterType: activeItem,
                    value: term,
                    indexes: dropdownTermsMap.raw[activeItem][term],
                    term
                };

                break;
            case DROPDOWN_TERMS.CULTURE:
                filter = {
                    filterType: activeItem,
                    value: term,
                    term,
                    culturesMap: dropdownTermsMap.raw.culturesMap[term]
                };

                break;
            default: filter = { filterType: activeItem, value: term, term };
        }

        // If this is for a manual application process, i.e. mobile.
        if (isManualApply) {
            // Years are handled separately as their terms are representative of a shifting bounds.
            if (activeItem !== DROPDOWN_TERMS.YEAR) {
                if (pendingTerms.map(({ term: pTerm }) => pTerm).includes(term)) {
                    updatePendingTerms(pendingTerms.filter(pendingTerm => pendingTerm.term !== term));
                } else {
                    updatePendingTerms([...pendingTerms, filter]);
                }

            // To handle year filters
            } else {
                // Find if there is an existing year filter.
                const yearPendingIndex = pendingTerms.findIndex(pendingTerm => pendingTerm.filterType === DROPDOWN_TERMS.YEAR);
                if (Number.isInteger(yearPendingIndex)) {
                    updatePendingTerms([...pendingTerms.slice(0, yearPendingIndex), ...pendingTerms.slice(yearPendingIndex + 1), filter]);
                } else {
                    updatePendingTerms([...pendingTerms, filter]);
                }
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
                return [...acc.slice(0, index), ...acc.slice(index + 1, acc.length)];

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
        const newActiveTerms = this.getNewTerms();

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
        const { activeItem, dropdownTermsMap } = this.state;
        const { pendingTerms, activeTerms, topOffset } = this.props;
        const data = dropdownTermsMap[activeItem];
        
        // Props that are spread regardless of MediaQuery outcome.
        const listedContentSpreadProps = {
            data,
            activeTerms,
            pendingTerms,
        };

        switch (activeItem) {
            case (DROPDOWN_TERMS.ARTIST): 
                // Dropdown for artist should only be rendered for desktop devices.
                return (
                    <MediaQuery maxDeviceWidth={BREAKPOINTS.tablet_max}>
                        <DropdownMenu
                            headerText={term}
                            clear={() => this.setActiveItem(null)}
                            topOffset={topOffset}
                            hasQuickScroll
                        >
                            {/** This will always behave in the manual application process. */}
                            <ArtistSideMenuContent
                                hasScroll
                                data={dropdownTermsMap[DROPDOWN_TERMS.ARTIST]}
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
                );

            case (DROPDOWN_TERMS.YEAR): 
                return (
                    <DropdownMenu
                        headerText={term}
                        clear={() => this.setActiveItem(null)}
                        noScroll
                        topOffset={topOffset}
                    >
                        <MediaQuery maxDeviceWidth={BREAKPOINTS.tablet_max}>
                            <YearInput
                                setActiveTerm={term => this.setActiveTerm(term, true)}
                                years={dropdownTermsMap[DROPDOWN_TERMS.YEAR]}
                            />
                        </MediaQuery>
                        <MediaQuery minDeviceWidth={BREAKPOINTS.tablet_max + 1}>
                            <YearInput
                                isDropdown
                                setActiveTerm={term => this.setActiveTerm(term, false)}
                                years={dropdownTermsMap[DROPDOWN_TERMS.YEAR]}
                            />
                        </MediaQuery>
                    </DropdownMenu>
                );

            default:
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
    };

    /**
     * On mount: 
     * 1) Set up reset function for HOC that keeps track of clicking out of dropdown. @see ClickTracker.jsx
     * 2) Set up function to apply pending terms in parent component. @see SearchInput.jsx
     * */
    async componentDidMount() {
        const { setResetFunction, setApplyPendingTerms } = this.props;
        setResetFunction(() => this.setActiveItem(null));
        setApplyPendingTerms(this.applyPendingTerms);

        const searchAssets = await getSearchAssets();
    
        this.setState({
            dropdownTermsMap: {
                [DROPDOWN_TERMS.CULTURE]: [
                    ...searchAssets.cultures, // Individual cultures.
                    ...Object.keys(searchAssets.culturesMap) // Meta cultures
                ]
                    .sort() // Sort all cultures alphabetically.
                    .map(key => ({ key })),
                [DROPDOWN_TERMS.CATEGORY]: searchAssets.classifications,
                [DROPDOWN_TERMS.ROOM]: Object.keys(searchAssets.locations).map(key => ({ key })), 
                [DROPDOWN_TERMS.COPYRIGHT]: Object.keys(searchAssets.copyrights).map(key => ({ key })),
                [DROPDOWN_TERMS.ARTIST]: searchAssets.artists,
                [DROPDOWN_TERMS.YEAR]: searchAssets.years
                    .map(year => parseInt(year))
                    .sort(), // Should be sorted, but sort anyways in case of any change to searchAssets.

                // For avoiding dynamic import in redux.
                raw: {
                    [DROPDOWN_TERMS.ROOM]: searchAssets.locations,
                    [DROPDOWN_TERMS.COPYRIGHT]: searchAssets.copyrights,
                    culturesMap: searchAssets.culturesMap,
                },
            }
        }); 
    }

    render() {
        const { activeItem, dropdownTermsMap } = this.state;
        const { activeTerms } = this.props;

        // Get count of each type of filter about to be appplied for superscript in dropdown button.
        const advancedFilterObject = this.getNewTerms()
            .reduce((acc, advancedFilter) => {
                // For all filters other than year, get a count.
                if (advancedFilter.filterType !== DROPDOWN_TERMS.YEAR) {
                    return { ...acc, [advancedFilter.filterType]: acc[advancedFilter.filterType] ? acc[advancedFilter.filterType] + 1 : 1 }

                // For year filter, max it out at one.
                } else {
                    return { ...acc, [advancedFilter.filterType]: 1 }
                }
            }, {});

        return (
            dropdownTermsMap && <div className='dropdowns-menu'>
                {DROPDOWN_TERMS_ARRAY.map((term, i) => {
                    const isLastDropdown = i === DROPDOWN_TERMS_ARRAY.length - 1;
                    const isActiveItem = activeItem === term;

                    // If this is the last item, we want to remove the chevron and add a | before the item.
                    let buttonClassName = 'font-delta dropdowns-menu__button';
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
                                    <sup className='dropdowns-menu__button-sup'>&nbsp;
                                        {advancedFilterObject[term]
                                    }</sup>
                                </span>
                                <Icon svgId='-icon_arrow_down' classes={iconClassName} />
                            </button>
                            
                            {isActiveItem && this.getDropdownContent(term)}
                            {/** TODO => Set up animations for mobile. */}
                            {/** Have transition for tablet devices. */}
                            {/* <MediaQuery
                                maxDeviceWidth={BREAKPOINTS.tablet_max}
                            >
                                <CSSTransitionGroup
                                    transitionName='dropdown-slide'
                                    transitionEnterTimeout={950}
                                    transitionLeaveTimeout={950}
                                >
                                    {isActiveItem && this.getDropdownContent(term)}
                                </CSSTransitionGroup>
                            </MediaQuery>

                            {/** Just render w/o animation for desktop. */}
                            {/* <MediaQuery minDeviceWidth={BREAKPOINTS.tablet_max + 1}>
                                {isActiveItem && this.getDropdownContent(term)}
                            </MediaQuery> */}
                        </div>
                    );
                })}
                
                <MediaQuery minDeviceWidth={BREAKPOINTS.tablet_max + 1}>
                    <ArtistSideMenu
                        isOpen={activeItem === DROPDOWN_TERMS.ARTIST}
                        closeMenu={() => this.setActiveItem(null)}
                    >
                        <ArtistSideMenuContent
                            data={dropdownTermsMap[DROPDOWN_TERMS.ARTIST]}
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
const mapDispatchToProps = (dispatch) => (
    bindActionCreators(
        Object.assign(
            {},
            {
                addAdvancedFilter,
                removeAdvancedFilter,
                setAdvancedFilters,
                toggleArtistMenu,
            }),
            dispatch,
        )
);
const ConnectedDropdownSection = connect(mapStateToProps, mapDispatchToProps)(DropdownSection);

// Wrap component in HOC that keeps track if a user has clicked out.
const WrappedAndConnectedDropdownSection = ({ ...props }) => (
    <ClickTracker {...props}>
        <ConnectedDropdownSection />
    </ClickTracker>
);

export { WrappedAndConnectedDropdownSection as Dropdowns }