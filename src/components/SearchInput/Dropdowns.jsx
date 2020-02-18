import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Icon from '../Icon';
import { ArtistSideMenu } from './ArtistSideMenu';
import { addAdvancedFilter, removeAdvancedFilter } from '../../actions/filters';
import searchAssets from '../../searchAssets.json';
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
const ListedContent = ({ data, activeTerms, setActiveTerm, isArtists }) => (
    <ul className='dropdown__list'>
        {data
            .filter(({ key }) => key) // Filter out null items.
            .map(({ key, doc_count }) => {
                const isActiveItem = activeTerms.includes(key);

                let listItemClassNames = 'dropdown__list-item';
                if (activeTerms.includes(key)) listItemClassNames = `${listItemClassNames} ${listItemClassNames}--active`;

                let dropdownIconClassNames = 'dropdown__icon';
                if (doc_count) dropdownIconClassNames = `${dropdownIconClassNames} dropdown__icon--artist`

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
const DropdownMenu = ({
    children,
    clear,
    headerText,
}) => (
    <div
        className='dropdowns-menu__dropdown dropdown'
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
        <div className='dropdown__content'>
            {children}
        </div>
    </div>
);

/** Dropdown menu for filtering artwork. */
class DropdownSection extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            activeItem: null,
        };
    };

    /**
     * Set active index to item clicked, if this is already the active index then reset to null.
     * @param {string} index - index of clicked item.
     */
    setActiveItem(term) {
        const { activeItem } = this.state;

        // If this is the current active item, reset to null.
        if (activeItem === term || term === null) {
            this.setState({ activeItem: null });
        } else {
            this.setState({ activeItem: term });
        }
    }

    /**
     * Add or remove selected term to filters.
     * @param {string} term - filter search term.
     */
    setActiveTerm = (term) => {
        const { activeItem } = this.state;
        const { activeTerms, addAdvancedFilter, removeAdvancedFilter } = this.props;

        // Create a filter to dispatch to redux store, this will be for the "Applied Filters" section.
        const filter = { filterType: activeItem, value: `${activeItem}: "${term}"`, term };

        // If we are removing an item, filter it out of the array, otherwise append it to the array.
        if (activeTerms.includes(term)) {
            removeAdvancedFilter(filter);
        } else {
            addAdvancedFilter(filter);
        }
    };

    /**
     * Get inner content for dropdown.
     * TODO => This generates a new element on every re-render, this should be a separate FC.
     * @param {string} term - name of clicked item.
     * @returns {JSX.Element} JSX to be rendered inside of Dropdown.
     */
    getDropdownContent = (term) => {
        const { activeItem } = this.state;
        const { activeTerms } = this.props;
        const data = DROPDOWN_TERMS_MAP[activeItem];

        switch (activeItem) {
            // Do not return for artist, as menu needs to be stateful for animation.
            case (DROPDOWN_TERMS.ARTIST): return null;
            case (DROPDOWN_TERMS.YEAR): {
                return (
                    <DropdownMenu
                        headerText={term}
                        clear={() => this.setActiveItem(null)}
                    >
                        <span>Lorem Ipsum</span>;
                    </DropdownMenu>
                );
            };
            default: {
                return (
                    <DropdownMenu
                        headerText={term}
                        clear={() => this.setActiveItem(null)}
                    >
                        <ListedContent
                            data={data}
                            activeTerms={activeTerms}
                            setActiveTerm={this.setActiveTerm}
                        />
                    </DropdownMenu>
                );
            }
        }
    };

    // On mount, set up reset function for HOC that keeps track of clicking out of dropdown.
    componentWillMount() {
        const { setResetFunction } = this.props;
        setResetFunction(() => this.setActiveItem(null))
    }

    render() {
        const { activeItem } = this.state;
        const { activeTerms, dropdownsActive } = this.props;
        
        let dropdownsMenuClassName = 'dropdowns-menu';
        if (dropdownsActive) dropdownsMenuClassName = `${dropdownsMenuClassName} dropdowns-menu--active`

        return (
            <div className={dropdownsMenuClassName}>
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
                                <span className='dropdowns-menu__button-content'>{term}</span>
                                <Icon svgId='-icon_arrow_down' classes={iconClassName} />
                            </button>
                            {isActiveItem && this.getDropdownContent(term)}
                        </div>
                    );
                })}

                <ArtistSideMenu
                    isOpen={activeItem === DROPDOWN_TERMS.ARTIST}
                    closeMenu={() => this.setActiveItem(null)}
                    data={DROPDOWN_TERMS_MAP[DROPDOWN_TERMS.ARTIST]}
                    // Sort data inside of artistMenu component.
                    render={sortedData => (
                        <ListedContent
                            isArtists
                            data={sortedData}
                            activeTerms={activeTerms}
                            setActiveTerm={this.setActiveTerm}
                        />
                    )}
                />
            </div>
        )
    }
};

const mapStateToProps = state => ({
    activeTerms: Object.values(state.filters.advancedFilters) // Go over every key in advanced filter.
        .flatMap((value) => (Object.values(value)).map(({ term }) => term)) // Go through every object value and get the term, flatMap into single array.
});  
const mapDispatchToProps = dispatch => bindActionCreators(Object.assign({}, { addAdvancedFilter, removeAdvancedFilter }), dispatch);
const Dropdowns = connect(mapStateToProps, mapDispatchToProps)(DropdownSection);

/** Component to keep track of clicking outside of menu. */
class ClickTracker extends Component {
    constructor(props) {
        super(props);

        this.ref = null; // Ref for wrapper div.

        // This will essentially be () => reset() for Dropdowns on cDM.
        this.state = { resetFunction: null };
    }

    // Listen to clicks outside of div and cleanup on unmount.
    componentDidMount() { document.addEventListener('mousedown', this.handleClick) }
    componentWillUnmount() { document.removeEventListener('mousedown', this.handleClick) }

    // On click outside of dropdown.
    handleClick = (event) => {
        const { resetFunction } = this.state;

        // If the ref is set up, the event is outside of the ref, and resetFunction was set in cDM.
        if (this.ref && !this.ref.contains(event.target) && resetFunction) {
            resetFunction(); // Reset on click out
        }
    };

    // Set reset function.
    setResetFunction = resetFunction => this.setState({ resetFunction });
    
    render() {
        return (
            <div ref={ref => this.ref = ref}>
                <Dropdowns {...this.props} setResetFunction={this.setResetFunction}/>
            </div>
        );
    }
}

export { ClickTracker as Dropdowns };
