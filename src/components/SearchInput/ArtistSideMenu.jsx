import React, { Component } from 'react';
import { SideMenu } from '../SideMenu/SideMenu';

// Set up options for artists radios.
const ARTISTS_RADIOS = { ABUNDANCE: 'Abundance', ALPHABETICAL: 'Alphabetical '};
const ARTISTS_RADIOS_ARRAY = [ARTISTS_RADIOS.ABUNDANCE, ARTISTS_RADIOS.ALPHABETICAL];

export class ArtistSideMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            artistRadio: ARTISTS_RADIOS.ABUNDANCE
        }
    }

    /**
     * On filter sort change.
     */
    changeSort = (artistRadio) => {
        const { setFilterPredicate } = this.props;

        // TODO => Fix this, pass data into component.
        if (artistRadio === ARTISTS_RADIOS.ALPHABETICAL) {
            setFilterPredicate((a, b) => {
                if (a.key < b.key) return -1;
                if (a.key > b.key) return 1;
                return 0;
            });
        } else {
            setFilterPredicate((a, b) => {
                if (a.doc_count > b.doc_count) return -1;
                if (a.doc_count < b.doc_count) return 1;
                return 0;
            });
        }

        this.setState({ artistRadio });
    }
    
    render() {
        const { closeMenu, children } = this.props;

        return (
            <SideMenu
                isOpen={true}
                closeMenu={closeMenu}
            >
                <div>
                    <div className='side-menu__header'>Artists</div>
                    <div className='side-menu__radio-selection-container'>
                        {ARTISTS_RADIOS_ARRAY.map((value) => {
                            const isActive = this.state.artistRadio === value;

                            let radioTextClassNames = 'side-menu__radio-text';
                            if (isActive) radioTextClassNames = `${radioTextClassNames} side-menu__radio-text--active`

                            return (
                                <span
                                    key={value}
                                    className='side-menu__radio-container'
                                    onClick={() => this.changeSort(value)}
                                >
                                    <input
                                        type='radio'
                                        className='side-menu__radio'
                                        value={value}
                                        checked={isActive}
                                        onChange={() => this.changeSort(value)}
                                    />
                                    <span className={radioTextClassNames}>{value}</span>
                                </span>
                            )
                        })}
                    </div>
                    <div className='side-menu__artist-selection-container'>
                        {children}
                    </div>
                </div>
            </SideMenu>
        );
    }
};