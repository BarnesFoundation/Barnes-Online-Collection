import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LockScroll } from '../LockScroll';
import { SideMenu } from '../SideMenu/SideMenu';
import { SearchBar } from '../SearchInput/SearchBar';
import { MAIN_WEBSITE_DOMAIN } from '../../constants';
import './siteHeader.css';

// For header state.
const HEADER_HIDDEN = {
  DEFAULT: 'DEFAULT',
  LOCKED: 'LOCKED',
  UNLOCKED: 'UNLOCKED'
};

/**
 * JSX element for Barnes logos.
 */
const Logo = ({ size, width, height, logo, className }) => (
  <svg className={`a-logo__svg a-logo__svg--${size} ${className || ''}`} width={width} height={height} aria-labelledby='logo-title'>
    <title id='logo-title'>Barnes</title>
    <use xlinkHref={`#icon--logo-${logo || size}`}></use>
  </svg>
);

// Static info mapped to static Logo JSX element.
const logoSizes = [
  { size: 's', width: 121, height: 37 },
  { size: 'm', width: 146, height: 45 },
  { size: 'l', width: 164.958, height: 50 },
  { size: 'xl', width: 200, height: 62 }
];

const logo100Sizes = [
  { size: 'xs', width: 121, height: 150, logo: '100' },
  { size: 's', width: 263.66, height: 37, logo: '100H' },
  { size: 'm', width: 320.67, height: 45, logo: '100H' },
  { size: 'l', width: 164.958, height: 150, logo: '100' },
  { size: 'xl', width: 200, height: 150, logo: '100' }
];

const Logos = ({ ref, tabIndex, isCentennial }) => (
  <a
    className='a-logo g-header__logo'
    href={MAIN_WEBSITE_DOMAIN}
    tabIndex={tabIndex}
    ref={ref}
  >
    {isCentennial
      ? (
          logo100Sizes.map(logo => <Logo key={logo.size} {...logo} className="a-logo__svg--100" />)
        )
      : (
          logoSizes.map(logo => <Logo key={logo.size} {...logo} />)
        )}

  </a>
);

const SUGGESTED_TERMS = ['CAREERS', 'CONTACT', 'SHOP', 'INTERNSHIP', 'MEMBERSHIP', 'PARKING', 'RESTAURANT', 'TICKETS'];

const MobileLinks = () => (
  <div className='container header-mobile-links-section header-mobile-links-section--active'>
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
  constructor (props) {
    super(props);

    this.state = {
      isSideMenuOpen: false,
      isHeaderHidden: HEADER_HIDDEN.DEFAULT
    };

    this.startRef = null;
    this.endRef = null;
  }

  keyListener = (e) => {
    const {
      isSideMenuOpen,
      isHeaderHidden
    } = this.state;
    const { isGlobalSearchHeader, toggleGlobalSearch, isGlobalSearchActive } = this.props;

    if (
      e.key === 'Tab' &&
      !isSideMenuOpen &&
      (isHeaderHidden === HEADER_HIDDEN.DEFAULT || isHeaderHidden === HEADER_HIDDEN.LOCKED) &&
      this.startRef &&
      this.endRef &&
      document.activeElement === this.endRef
    ) {
      this.startRef.focus();
    }

    if (
      e.key === 'Escape' &&
      !isSideMenuOpen &&
      isGlobalSearchHeader &&
      isGlobalSearchActive
    ) {
      toggleGlobalSearch();
    }
  };

  /**
   * Add event listener for scroll on mount.
   */
  componentDidMount () {
    window.addEventListener('scroll', this.scroll);
    document.addEventListener('keydown', this.keyListener);
  }

  /**
   * Cleanup event listener on unmount
   */
  componentWillUnmount () {
    window.removeEventListener('scroll', this.scroll);
    document.removeEventListener('keydown', this.keyListener);
  }

  /**
   * IIFE to keep w/ stateful variable to keep track of scroll state.
   * Wrapped in STO, per: @see https://developer.mozilla.org/en-US/docs/Web/API/Document/scroll_event
   */
  scroll = (() => {
    // State object for closure, keeps track if a scroll event has been fired and last scroll position.
    const scrollState = {
      isScrolling: false,
      height: 0
    };

    return () => {
      // Only perform update if this has not already been fired.
      const { isArtistMenuToggled, isGlobalSearchActive } = this.props;

      if (!scrollState.isScrolling) {
        scrollState.isScrolling = true; // Set firing status to true.

        setTimeout(() => {
          const { height: previousScrollHeight } = scrollState;
          const currentScrollHeight = window.pageYOffset;
          const { isSideMenuOpen } = this.state;

          if (!isSideMenuOpen && !isArtistMenuToggled) {
            let isHeaderHidden = HEADER_HIDDEN.DEFAULT; // Default is fixed position at top 0.
            if ((currentScrollHeight > 50 && previousScrollHeight < currentScrollHeight) || isGlobalSearchActive) {
              isHeaderHidden = HEADER_HIDDEN.UNLOCKED; // Translate off screen.
            } else if (currentScrollHeight < previousScrollHeight && currentScrollHeight > 250) {
              isHeaderHidden = HEADER_HIDDEN.LOCKED; // Translate on screen.
            }

            // Update React component state.
            this.setState({ isHeaderHidden });
          }

          // Update closure state.
          scrollState.height = currentScrollHeight; // Update scrollState height variable.
          scrollState.isScrolling = false; // Reset firing status.
        }, 100); // TODO => This is a magic number, replace this.
      }
    };
  })();

  openSideMenu = () => this.setState({ isSideMenuOpen: true });

  render () {
    const { isHeaderHidden, isSideMenuOpen } = this.state;
    const { isArtObject, isGlobalSearchHeader, toggleGlobalSearch, isGlobalSearchActive, isSecond, isTour, isNotFound } = this.props;

    let isArtObjectClassNames = isArtObject ? 'art-object-header' : null; // Define class to change color of header and padding.
    const isNotFoundClassNames = isNotFound ? 'not-found-header' : null; // Define class to change color of header and padding.
    if (isArtObjectClassNames && isSecond) isArtObjectClassNames = `${isArtObjectClassNames} art-object-header--absolute`; // For second menu on artist page, absolutely position second menu.

    // Set up g-header classes.
    let ariaHidden = false;
    let ariaExpandedNav = false;
    const tabIndex = (
      (
        (!isGlobalSearchHeader && isHeaderHidden === HEADER_HIDDEN.LOCKED) ||
        (!isGlobalSearchHeader && isHeaderHidden === HEADER_HIDDEN.DEFAULT) ||
        (isGlobalSearchHeader && isGlobalSearchActive)
      ) &&
      !isSideMenuOpen
    )
      ? 0
      : -1;

    let gHeaderClassNames = 'g-header';
    if ((!isGlobalSearchHeader && isHeaderHidden === HEADER_HIDDEN.UNLOCKED) || (isGlobalSearchHeader && !isGlobalSearchActive)) {
      gHeaderClassNames = `${gHeaderClassNames} g-header--unlocked`;
      ariaHidden = true;
    }

    if ((!isGlobalSearchHeader && isHeaderHidden === HEADER_HIDDEN.LOCKED) || (isGlobalSearchHeader && isGlobalSearchActive)) {
      gHeaderClassNames = `${gHeaderClassNames} g-header--locked`;
      ariaHidden = false;
      ariaExpandedNav = true;
    }

    let gHeaderNavLinkClassNames = 'g-header__nav__link';
    if (!isGlobalSearchActive) gHeaderNavLinkClassNames = `${gHeaderNavLinkClassNames} g-header__nav__link--active`;

    let gHeaderBtnClassNames = 'g-header__nav__btn g-header__btn__search btn btn--icon-only html4-hidden';
    if (isGlobalSearchActive) gHeaderBtnClassNames = `${gHeaderBtnClassNames} g-header__nav__btn--active`;

    const gHeaderNavClassNames = 'g-header__nav';

    // Get year to determine whether to use centennial logo or original logo
    const today = new Date();
    const isCentennial = true;
    // const isCentennial = today.getFullYear() === 2022;

    return (
      <div className={isArtObjectClassNames}>
        <header
          className={gHeaderClassNames}
          data-behavior='header'
          aria-hidden={ariaHidden}
          role="banner"
        >
          <div className={`container ${isNotFoundClassNames}`}>
            <Logos ref={ref => this.startRef = ref} tabIndex={tabIndex} isCentennial={isCentennial} />
            <nav className={gHeaderNavClassNames}>
              <a
                className='g-header__nav__link'
                href={MAIN_WEBSITE_DOMAIN + '/whats-on'}
                tabIndex={tabIndex}
              >
                What’s On
              </a>
              <a
                className='g-header__nav__link'
                href={MAIN_WEBSITE_DOMAIN + '/plan-your-visit'}
                tabIndex={tabIndex}
              >
                  Plan Your Visit
              </a>
              <a
                className={gHeaderNavLinkClassNames}
                href='/'
                tabIndex={tabIndex}
              >
                  Our Collection
              </a>
              <a
                className='g-header__nav__link'
                href={MAIN_WEBSITE_DOMAIN + '/classes'}
                tabIndex={tabIndex}
              >
                  Take a Class
              </a>
              <btn
                onClick={toggleGlobalSearch}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    toggleGlobalSearch();
                  }
                }}
                className={gHeaderBtnClassNames}
                tabIndex={tabIndex}
                aria-expanded={ariaExpandedNav}
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
                tabIndex={tabIndex}
              >
                <svg width='26' height='26'>
                  <title id='nav-open-title'>Menu</title>
                  <use xlinkHref='#icon--icon_menu'></use>
                </svg>
              </button>
            </nav>
          </div>

          {!isTour
            ? // Display the mobile links for all pages except for tours
              <MobileLinks />
            : null
          }

          {isGlobalSearchHeader &&
            <div className='global-search'>
              {isGlobalSearchActive &&
                <SearchBar
                  autoSuggest={true}
                  className='container search__searchbar'
                  submit={(query) => window.location.href = `${MAIN_WEBSITE_DOMAIN}/search?q=${query}`}
                  tabIndex={tabIndex}
                />
              }
              <div className='container global-search__buttons-area'>
                <span className='global-search__buttons-term'>Suggested terms</span>
                <div className='global-search__buttons-group'>
                  {SUGGESTED_TERMS.map((term, i) => {
                    let additionalProps;
                    if (i === SUGGESTED_TERMS.length - 1) {
                      additionalProps = { ...additionalProps, ref: ref => this.endRef = ref };
                    }

                    return (
                      <button
                        key={term}
                        className='btn font-zeta global-search__button'
                        onClick={(e) => window.location.href = `${MAIN_WEBSITE_DOMAIN}/search?q=${term.toLowerCase()}`}
                        tabIndex={tabIndex}
                        {...additionalProps}
                      >
                        {term}
                      </button>
                    );
                  }
                  )}
                </div>
              </div>
            </div>
          }
          <SideMenu
              closeMenu={() => {
                // Wait for current event loop to complete to prevent race condition in keypress handler.
                setTimeout(() => {
                  this.setState({ isSideMenuOpen: false });
                }, 0);

                if (this.startRef) {
                  this.startRef.focus();
                }
              }}
              isOpen={isSideMenuOpen}
          />
        </header>
      </div>
    );
  }
}

const mapStateToProps = state => ({ isArtistMenuToggled: state.filterSets.isArtistMenuToggled });
const ConnectedSiteHeader = connect(mapStateToProps)(SiteHeader);

class SiteHeaderGlobalSearch extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isGlobalSearchActive: false,
      overlayActive: false
    };
  }

  setGlobalSearchStatus = (isGlobalSearchActive) => {
    this.setState({ isGlobalSearchActive });

    // This drops the z-index of the shaded overlay only after animation has completed, to prevent a FOUC.
    if (isGlobalSearchActive) {
      this.setState({ overlayActive: true });
    } else {
      setTimeout(() => this.setState({ overlayActive: false }), 300);
    }
  };

  render () {
    const { isArtObject, isTour, isNotFound } = this.props;
    const { isGlobalSearchActive, overlayActive } = this.state;

    // Apply shaded overlay classes. These are applied in this order so the z-index of higher is not overwritten.
    let shadedOverlayClassNames = 'shaded-background__tint';
    if (isGlobalSearchActive) shadedOverlayClassNames = `${shadedOverlayClassNames} shaded-background__tint--active`;
    if (overlayActive) shadedOverlayClassNames = `${shadedOverlayClassNames} shaded-background__tint--higher`;

    return (
      <div>
        <ConnectedSiteHeader
          isArtObject={Boolean(isArtObject)}
          isGlobalSearchActive={isGlobalSearchActive}
          toggleGlobalSearch={() => this.setGlobalSearchStatus(!isGlobalSearchActive)}
          isTour={Boolean(isTour)}
          isNotFound={Boolean(isNotFound)}
        />
        <ConnectedSiteHeader
          isGlobalSearchHeader
          isGlobalSearchActive={isGlobalSearchActive}
          isArtObject={Boolean(isArtObject)}
          isSecond
          toggleGlobalSearch={() => this.setGlobalSearchStatus(!isGlobalSearchActive)}
          isTour={Boolean(isTour)}
          isNotFound={Boolean(isNotFound)}
        />
        {/* Lock scroll on global search activation. */}
        <LockScroll isLocked={isGlobalSearchActive}/>
        <div
          className='shaded-background shaded-background--header'
          onClick={() => this.setGlobalSearchStatus(false)}
        >
          <div className={shadedOverlayClassNames}></div>
        </div>
      </div>
    );
  }
}

export { SiteHeaderGlobalSearch as SiteHeader };
