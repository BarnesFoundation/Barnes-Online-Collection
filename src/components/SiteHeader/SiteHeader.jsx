import React, { Component } from 'react';
import { LockScroll } from '../LockScroll';
import { SideMenu } from '../SideMenu/SideMenu';
import { MAIN_WEBSITE_DOMAIN } from '../../constants';
import './siteHeader.css';

const HEADER_HIDDEN = {
  DEFAULT: 'DEFAULT',
  LOCKED: 'LOCKED',
  UNLOCKED: 'UNLOCKED',
};

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
    let gHeaderClassNames = 'g-header';
    if ((!isGlobalSearchHeader && isHeaderHidden === HEADER_HIDDEN.UNLOCKED) || (isGlobalSearchHeader && !isGlobalSearchActive)) gHeaderClassNames = `${gHeaderClassNames} g-header--unlocked`;
    if ((!isGlobalSearchHeader && isHeaderHidden === HEADER_HIDDEN.LOCKED) || (isGlobalSearchHeader && isGlobalSearchActive)) gHeaderClassNames = `${gHeaderClassNames} g-header--locked`;

    return (
      <div className={isArtObjectClassNames}>
        <header className={gHeaderClassNames} data-behavior='header'>
          <div className='container'>
            <a className='a-logo g-header__logo' href={MAIN_WEBSITE_DOMAIN}>
              <span className='html4-label'>Barnes</span>
              <svg className='a-logo__svg a-logo__svg--s' width='121' height='37' aria-labelledby='logo-title'>
                <title id='logo-title'>Barnes</title>
                <use xlinkHref='#icon--logo-s'></use>
              </svg>
              <svg className='a-logo__svg a-logo__svg--m' width='146' height='45'>
                <title>Barnes</title>
                <use xlinkHref='#icon--logo-m'></use>
              </svg>
              <svg className='a-logo__svg a-logo__svg--l' width='164.958' height='50'>
                <title>Barnes</title>
                <use xlinkHref='#icon--logo-l'></use>
              </svg>
              <svg className='a-logo__svg a-logo__svg--xl' width='200' height='62'>
                <title>Barnes</title>
                <use xlinkHref='#icon--logo-xl'></use>
              </svg>
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
          {isGlobalSearchHeader &&
            <div className='container global-search search__input-group'>
                <input
                  className='search__input'
                  type='text'
                  autoFocus='true'
                  // value={this.state.value}
                  placeholder='Search'
                  // onChange={this.onChange}
                  // onFocus={() => this.setFocus(true)}
                  // onBlur={() => this.setFocus(false)}
                />
                <button
                  className='btn btn--primary search__button'
                  type='submit'
                  onClick={this.submit}
                >
                  Search
                </button>
            </div>
          }
          <MobileLinks />
          
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

    this.state = {
      isGlobalSearchActive: true,
    }
  };

  render() {
    const { isArtObject } = this.props;
    const { isGlobalSearchActive } = this.state;

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
      </div>
    );
  }
}

export { SiteHeaderGlobalSearch as SiteHeader };