import React, { Component } from 'react';
import Icon from '../Icon';
import './dropdownsMenu.css';

const DROPDOWN_TERMS = ['Culture', 'Year', 'Medium', 'Colors', 'Copyright', 'Artist'];

const getDropdownContent = (term) => {
    switch(term) {
        case 1: {
            return 
        }
    }
};

/** Dropdown menu for filtering artwork. */
export class Dropdowns extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: null
        };
    };

    /**
     * Set active index to item clicked, if this is already the active index then reset to null.
     * @param {number} index - index of clicked item.
     */
    setActiveItem(index) {
        const { activeItem } = this.state;

        // If this is the current active item, reset to null.
        if (activeItem === index) {
            this.setState({ activeItem: null });
        } else {
            this.setState({ activeItem: index });
        }
    }

    render() {
        const { activeItem } = this.state;

        return (
            <div className='dropdowns-menu'>
                {DROPDOWN_TERMS.map((term, i) => {
                    const isLastDropdown = Boolean(i === DROPDOWN_TERMS.length - 1);

                    // If this is the last item, we want to remove the chevron and add a | before the item.
                    let buttonClassName = 'dropdowns-menu__button';
                    if (isLastDropdown) buttonClassName = `${buttonClassName} dropdowns-menu__button--last`;

                    // If this is the active item, we want to flip the chevron.
                    let iconClassName = 'dropdowns-menu__icon';
                    if (activeItem === i) iconClassName = `${iconClassName} dropdowns-menu__icon--active`;
                    
                    return (
                        <button
                            key={term}
                            className={buttonClassName}
                            onClick={() => this.setActiveItem(i)}
                        >
                            <span className='dropdowns-menu__button-content'>{term}</span>
                            {!isLastDropdown && <Icon svgId='-icon_arrow_down' classes={iconClassName} />}
                        </button>
                    );
                })}
            </div>
        )
    }
};
