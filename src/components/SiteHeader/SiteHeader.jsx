import React, { Component } from 'react';
import { LockScroll } from '../LockScroll';
import { SideMenu } from '../SideMenu/SideMenu';
import { SearchBar } from '../SearchInput/SearchBar';
import { MAIN_WEBSITE_DOMAIN } from '../../constants';
import './siteHeader.css';

// For header state.
const HEADER_HIDDEN = {
  DEFAULT: 'DEFAULT',
  LOCKED: 'LOCKED',
  UNLOCKED: 'UNLOCKED',
};

/**
 * JSX element for Barnes logos.
 */
const Logo = ({ size, width, height }) => (
  <svg className={`a-logo__svg a-logo__svg--${size}`} width={width} height={height} aria-labelledby='logo-title'>
    <title id='logo-title'>Barnes</title>
    <use xlinkHref={`#icon--logo-${size}`}></use>
  </svg>
);

// Static info mapped to static Logo JSX element.
const LOGOS = [
  { size: 's', width: 121, height: 37 },
  { size: 'm', width: 146, height: 45 },
  { size: 'l', width: 164.958, height: 50 },
  { size: 'xl', width: 200, height: 62 },
].map((logo => <Logo key={logo.size} {...logo} />));

const SUGGESTED_TERMS = ['CAREERS', 'CONTACT', 'SHOP', 'INTERNSHIP', 'MEMBERSHIP', 'PARKING', 'RESTAURANT', 'TICKETS'];

const MobileLinks = () => (
  <div className='container header-mobile-links-section'>
    <div>
      <a
        className='header-mobile-links-section__link'
        href='https://tickets.barnesfoundation.org/orders/316/calendar'>
        Buy Tickets
      </a>
      <a
        className='header-mobile-links-section__link'
        href='https://barnesfoundation.org/plan-your-visit'
      >
        Visit
      </a>
    </div>
  </div>
);

class SiteHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSideMenuOpen: false,
      isHeaderHidden: false,
    };
  }

  /**
   * Add event listener for scroll on mount and cleanup event listener on unmount.
   */
  componentDidMount() { window.addEventListener('scroll', this.scroll); }
  componentWillUnmount() { window.removeEventListener('scroll', this.scroll); }

  /**
   * IIFE to keep w/ stateful variable to keep track of scroll state.
   * Wrapped in STO, per: @see https://developer.mozilla.org/en-US/docs/Web/API/Document/scroll_event
   */
  scroll = (() => {
    // State object for closure, keeps track if a scroll event has been fired and last scroll position.
    const scrollState = {
      isScrolling: false,
      height: 0,
    };

    return () => {
      // Only perform update if this has not already been fired.
      if (!scrollState.isScrolling) {
        scrollState.isScrolling = true; // Set firing status to true.

        setTimeout(() => {
          const { height: previousScrollHeight } = scrollState;
          const currentScrollHeight = window.pageYOffset;

          let isHeaderHidden = HEADER_HIDDEN.DEFAULT; // Default is fixed position at top 0.
          if (currentScrollHeight > 50 && previousScrollHeight < currentScrollHeight) isHeaderHidden = HEADER_HIDDEN.UNLOCKED; // Translate off screen.
          if (Boolean(currentScrollHeight < previousScrollHeight && currentScrollHeight > 250)) isHeaderHidden = HEADER_HIDDEN.LOCKED; // Translate on screen.

          // Update React component state.
          this.setState({ isHeaderHidden });

          // Update closure state.
          scrollState.height = currentScrollHeight; // Update scrollState height variable.
          scrollState.isScrolling = false; // Reset firing status.
        }, 100); // TODO => This is a magic number, replace this.
      }
    };
  })();

  openSideMenu = (e) => {
    this.setState({ isSideMenuOpen: true });
  }

  render() {
    const { isHeaderHidden } = this.state;
    const { isArtObject, isGlobalSearchHeader, toggleGlobalSearch, isGlobalSearchActive } = this.props;

    const isArtObjectClassNames = isArtObject ? 'art-object-header' : null; // Define class to change color of header and padding.

    // Set up g-header classes.
    // TODO => Change this to be more expressive.
    let gHeaderClassNames = 'g-header';
    if ((!isGlobalSearchHeader && isHeaderHidden === HEADER_HIDDEN.UNLOCKED) || (isGlobalSearchHeader && !isGlobalSearchActive)) gHeaderClassNames = `${gHeaderClassNames} g-header--unlocked`;
    if ((!isGlobalSearchHeader && isHeaderHidden === HEADER_HIDDEN.LOCKED) || (isGlobalSearchHeader && isGlobalSearchActive)) gHeaderClassNames = `${gHeaderClassNames} g-header--locked`;

    return (
      <div className={isArtObjectClassNames}>
        <header className={gHeaderClassNames} data-behavior='header'>
          <div className='container'>
            <a className='a-logo g-header__logo' href={MAIN_WEBSITE_DOMAIN}>
              {LOGOS}
            </a>
            <nav className='g-header__nav'>
              <a className='g-header__nav__link' href={MAIN_WEBSITE_DOMAIN + '/whats-on'}>What’s On</a>
              <a className='g-header__nav__link' href={MAIN_WEBSITE_DOMAIN + '/plan-your-visit'}>Plan your Visit</a>
              <a className={Boolean(!isGlobalSearchActive) ? 'g-header__nav__link g-header__nav__link--active' : 'g-header__nav__link'} href='/'>Our Collection</a>
              <a className='g-header__nav__link' href={MAIN_WEBSITE_DOMAIN + '/classes'}>Take a Class</a>
              <btn
                onClick={toggleGlobalSearch}
                aria-current={Boolean(isGlobalSearchActive)}
                className='g-header__nav__btn g-header__btn__search btn btn--icon-only html4-hidden'
              >
                <svg width='26' height='26'>
                  <title id='search-open-title'>Search</title>
                  <use xlinkHref='#icon--icon_search'></use>
                </svg>
              </btn>
              <button
                onClick={this.openSideMenu}
                className='g-header__nav__btn btn btn--icon-only html4-hidden'
                data-nav-show
                type='button'
                aria-labelledby='nav-open-title'
              >
                <svg width='26' height='26'>
                  <title id='nav-open-title'>Menu</title>
                  <use xlinkHref='#icon--icon_menu'></use>
                </svg>
              </button>
            </nav>
          </div>
          <MobileLinks />
          {isGlobalSearchHeader &&
            <div className='global-search'>
              <SearchBar
                className='container search__searchbar--global'
                submit={() => console.error('This is not set up yet.')}
              />
              <div className='container global-search__buttons-area'>
                <span className='global-search__buttons-term'>Suggested terms</span>
                <div className='global-search__buttons-group'>
                  {SUGGESTED_TERMS.map(term => <button className='btn font-zeta global-search__button '>{term}</button>)}
                </div>
              </div>
            </div>
          }
          <SideMenu
              closeMenu={() => this.setState({ isSideMenuOpen: false })}
              isOpen={this.state.isSideMenuOpen}
          />
        </header>
      </div>
    );
  }
};

class SiteHeaderGlobalSearch extends Component {
  constructor(props) {
    super(props);

    this.state = { isGlobalSearchActive: false };
  };

  render() {
    const { isArtObject } = this.props;
    const { isGlobalSearchActive } = this.state;

    // Apply shaded overlay classes. These are applied in this order so the z-index of higher is not overwritten.
    let shadedOverlayClassNames = 'shaded-background__tint'
    if (isGlobalSearchActive) shadedOverlayClassNames = `${shadedOverlayClassNames} shaded-background__tint--active`;
    shadedOverlayClassNames = `${shadedOverlayClassNames} shaded-background__tint--higher`;

    return (
      <div>
        <SiteHeader
          isArtObject={Boolean(isArtObject)}
          toggleGlobalSearch={() => this.setState({ isGlobalSearchActive: !isGlobalSearchActive }) }
        />
        <SiteHeader
          isGlobalSearchHeader
          isGlobalSearchActive={isGlobalSearchActive}
          isArtObject={Boolean(isArtObject)}
          toggleGlobalSearch={() => this.setState({ isGlobalSearchActive: !isGlobalSearchActive }) }
        />
        {/* Lock scroll on global search activation. */}
        <LockScroll isLocked={isGlobalSearchActive}/>
        <div
          className='shaded-background shaded-background--header'
          onClick={() => this.setState({ isGlobalSearchActive: false })}
        >
          <div className={shadedOverlayClassNames}></div>
        </div>
      </div>
    );
  }
}

export { SiteHeaderGlobalSearch as SiteHeader };