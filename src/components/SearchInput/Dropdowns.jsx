import React, { Component } from 'react';
import Icon from '../Icon';
import assets from '../../constants/searchAssets.json';
import './dropdowns.css';

const DROPDOWN_TERMS = ['Culture', 'Year', 'Medium', 'Location', 'Copyright', 'Artist'];
const DROPDOWN_TERMS_MAP = {
    'Culture': assets.cultures,
    'Year': [],
    'Medium': [], // TODO => populate this.
    'Location': assets.locations, // 
    'Copyright': assets.copyrights,
    'Artist': assets.artists,
};

/**
 * Regular dropdown list.
 * @see getDropdownContent
 * */
const DropdownList = ({ data, activeTerms, setActiveTerm }) => (
    <ul className='dropdown__list'>
        {data
            .filter(({ key }) => key) // Filter out null items.
            .map(({ key }) => {
                const isActiveItem = activeTerms.includes(key);

                let listItemClassNames = 'dropdown__list-item';
                if (activeTerms.includes(key)) listItemClassNames = `${listItemClassNames} ${listItemClassNames}--active`;

                return (
                    <li
                        key={key}
                        className={listItemClassNames}
                        onClick={() => setActiveTerm(key)}
                    >
                        <span>{key}</span>
                        {isActiveItem && <Icon svgId='-icon_close' classes='dropdown__icon' />}
                    </li>
                );
            }
        )}
    </ul>
);

/** Dropdown menu for filtering artwork. */
export class Dropdowns extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: null,
            dropdownContent: null,
            activeTerms: [],
        };
    };

    /**
     * Set active index to item clicked, if this is already the active index then reset to null.
     * @param {string} index - index of clicked item.
     */
    setActiveItem(term) {
        const { activeItem } = this.state;

        // If this is the current active item, reset to null.
        if (activeItem === term) {
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
        const { activeTerms } = this.state;

        // If we are removing an item, filter it out of the array, otherwise append it to the array.
        if (activeTerms.includes(term)) {
            this.setState({ activeTerms: activeTerms.filter(activeTerm => activeTerm !== term) });
        } else {
            this.setState({ activeTerms: [...activeTerms, term] });
        }
    };

    /**
     * Get inner content for dropdown.
     * TODO => This generates a new element on every re-render, fix this.
     * @param {string} term - name of clicked item.
     * @returns {JSX.Element} JSX to be rendered inside of Dropdown.
     */
    getDropdownContent = () => {
        const { activeItem, activeTerms } = this.state;
        const data = DROPDOWN_TERMS_MAP[activeItem];

        switch (activeItem) {
            case('Year'): {
                return <span>Lorem Ipsum</span>;
            };
            case('Colors'): {
                return <span>Lorem Ipsum</span>;
            };
            default: {
                return (
                    <DropdownList
                        data={data}
                        activeTerms={activeTerms}
                        setActiveTerm={this.setActiveTerm}
                    />
                )
            }
        }
    };

    render() {
        const { activeItem } = this.state;

        return (
            <div className='dropdowns-menu'>
                {DROPDOWN_TERMS.map((term, i) => {
                    const isLastDropdown = i === DROPDOWN_TERMS.length - 1;
                    const isActiveItem = activeItem === term;

                    // If this is the last item, we want to remove the chevron and add a | before the item.
                    let buttonClassName = 'dropdowns-menu__button';
                    if (isLastDropdown) buttonClassName = `${buttonClassName} dropdowns-menu__button--last`;

                    // If this is the active item, we want to flip the chevron.
                    let iconClassName = 'dropdowns-menu__icon';
                    if (isActiveItem) iconClassName = `${iconClassName} dropdowns-menu__icon--active`;
                    
                    return (
                        <button
                            key={term}
                            className={buttonClassName}
                            onClick={() => this.setActiveItem(term)}
                        >
                            <span className='dropdowns-menu__button-content'>{term}</span>
                            {!isLastDropdown && <Icon svgId='-icon_arrow_down' classes={iconClassName} />}
                            {isActiveItem &&
                                // Prevent propogation of event to deselecting button with onClick.
                                <div
                                    className='dropdown'
                                    onClick={e => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                >
                                    <div className='dropdown__header'>
                                        <span className='font-delta dropdown__header--text'>{term}</span>
                                        <Icon svgId='-icon_close' classes='dropdown__icon dropdown__icon--x'/>
                                    </div>
                                    <div className='dropdown__content'>
                                        {this.getDropdownContent()}
                                    </div>
                                </div>
                            }
                        </button>
                    );
                })}
            </div>
        )
    }
};
