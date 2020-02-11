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
                            
                            return (
                            <span
                                key={value}
                                className='side-menu__radio-container'
                            >
                                <input
                                    type='radio'
                                    className='side-menu__radio'
                                    value={value}
                                    checked={this.state.artistRadio === value}
                                    onChange={() => {
                                        this.setState({ artistRadio: value })
                                    }}
                                />
                                <span className='side-menu__radio-text'>{value}</span>
                            </span>
                        )})}
                    </div>
                    <div className='side-menu__artist-selection-container'>
                        {children}
                    </div>
                </div>
            </SideMenu>
        );
    }
};