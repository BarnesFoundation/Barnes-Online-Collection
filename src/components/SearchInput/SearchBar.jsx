import React, { Component } from 'react';
import Icon from '../Icon';

/**
 * Controlled input component w/ search on enter.
 */
export class SearchBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
            isFocused: true,
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
    componentWillUnmount() { window.removeEventListener('keydown', this.searchOnEnter); }

    onChange = ({ target: { value } }) => this.setState({ value }); // For controlled component.
    setFocus = isFocused => this.setState({ isFocused }); // Set focus

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
        const { hasTooltip, className, placeholder, onFocus } = this.props;

        let searchClassName = 'search__searchbar';
        if (className) searchClassName = `search__searchbar ${className}`;

        return (
            <div className={searchClassName}>
                <div className='search__input-group'>
                    <input
                        className='search__input'
                        type='text'
                        // autoFocus={true}
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
