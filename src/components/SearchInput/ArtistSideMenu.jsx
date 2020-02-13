import React, { Component } from 'react';
import { SideMenu } from '../SideMenu/SideMenu';

// Set up options for artists radios.
const ARTISTS_RADIOS = { ABUNDANCE: 'Abundance', ALPHABETICAL: 'Alphabetical '};
const ARTISTS_RADIOS_ARRAY = [ARTISTS_RADIOS.ABUNDANCE, ARTISTS_RADIOS.ALPHABETICAL];

export class ArtistSideMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            artistRadio: ARTISTS_RADIOS.ABUNDANCE,
            data: this.props.data,
        }
    }

    /**
     * On filter sort change.
     */
    changeSort = (artistRadio) => {
        const { data } = this.props;

        this.setState({
            artistRadio,
            data: artistRadio === ARTISTS_RADIOS.ALPHABETICAL
                ? data.sort((a, b) => {
                    if (a.key < b.key) return -1;
                    if (a.key > b.key) return 1;
                    return 0;
                })
                : data.sort((a, b) => {
                    if (a.doc_count > b.doc_count) return -1;
                    if (a.doc_count < b.doc_count) return 1;
                    return 0;
                }),
        });
    }
    
    render() {
        const { closeMenu, render } = this.props;
        const { artistRadio, data } = this.state;
        
        return (
            <SideMenu
                isOpen={true}
                closeMenu={closeMenu}
            >
                <div>
                    <div className='side-menu__header'>Artists</div>
                    <div className='side-menu__radio-selection-container'>
                        {ARTISTS_RADIOS_ARRAY.map((value) => {
                            const isActive = artistRadio === value;

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
                        {render(data)}
                    </div>
                </div>
            </SideMenu>
        );
    }
};