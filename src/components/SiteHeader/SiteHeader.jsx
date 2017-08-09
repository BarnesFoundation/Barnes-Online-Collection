import React, { Component } from 'react';

import SiteHeaderMenu from './SiteHeaderMenu';

class SiteHeader extends Component {
  render() {
    return (
      <div>
        <header className="g-header" data-behavior="header">
          <div className="container">
            <a className="a-logo g-header__logo" href="/">
              <span className="html4-label">Barnes</span>
              <svg className="a-logo__svg a-logo__svg--s" width="121" height="37" aria-labelledby="logo-title">
                <title id="logo-title">Barnes</title>
                <use xlinkHref="#icon--logo-s"></use>
              </svg>
              <svg className="a-logo__svg a-logo__svg--m" width="146" height="45">
                <title>Barnes</title>
                <use xlinkHref="#icon--logo-m"></use>
              </svg>
              <svg className="a-logo__svg a-logo__svg--l" width="164.958" height="50">
                <title>Barnes</title>
                <use xlinkHref="#icon--logo-l"></use>
              </svg>
              <svg className="a-logo__svg a-logo__svg--xl" width="200" height="62">
                <title>Barnes</title>
                <use xlinkHref="#icon--logo-xl"></use>
              </svg>
            </a>
            <nav className="g-header__nav">
              <a className="g-header__nav__link" href="#">What’s On</a>
              <a className="g-header__nav__link" href="#">Plan your Visit</a>
              <a className="g-header__nav__link" href="#">Our Collection</a>
              <a className="g-header__nav__link" href="/static/pages/class.php">Take a Class</a>
              <button className="g-header__nav__btn btn btn--icon-only html4-hidden" data-nav-show type="button" aria-labelledby="search-open-title">
                <svg width="26" height="26">
                  <title id="search-open-title">Search</title>
                  <use xlinkHref="#icon--icon_search"></use>
                </svg>
              </button>
              <button className="g-header__nav__btn btn btn--icon-only html4-hidden" data-search-hide type="button" aria-labelledby="search-hide-title">
                <svg width="26" height="26">
                  <title id="search-hide-title">Hide Search</title>
                  <use xlinkHref="#icon--icon_search"></use>
                </svg>
              </button>
              <button className="g-header__nav__btn btn btn--icon-only html4-hidden" data-nav-show type="button" aria-labelledby="nav-open-title">
                <svg width="26" height="26">
                  <title id="nav-open-title">Menu</title>
                  <use xlinkHref="#icon--icon_menu"></use>
                </svg>
              </button>
            </nav>
          </div>
          <div className="m-search-bar" data-behavior="SearchBar" aria-hidden="true">
            <div className="container">
              <form className="m-search-bar__form" action="/static/pages/search.php" method="get" novalidate data-behavior="FormValidate">
                <div className="form-field__error form-field__error--summary hidden" tabindex="-1" aria-hidden="true">
                  <h3 className="font-bold-heading">Please correct your errors</h3>
                </div>
                <div className="form-field m-search-bar__form-field">
                  <label className="visuallyhidden" for="search">Search</label>
                  <input className="input" type="search" name="q" id="search" placeholder="Search" required aria-required="true" aria-describedby="searcherror1" />
                  <button className="btn btn--primary" type="submit">
                    Search
                  </button>
                  <div aria-hidden="true" className="form-field__error hidden" tabindex="-1" id="searcherror1">Enter a search term</div>
                </div>
              </form>
              <button className="m-search-bar__close btn btn--icon-only html4-hidden" type="button" data-search-hide aria-labelledby="search-close-title">
                <svg className="icon--close" width="20" height="20">
                  <title id="search-close-title">Close search</title>
                  <use xlinkHref="#icon--icon_close" />
                </svg>
              </button>
            </div>
          </div>
        </header>
        <div className="g-nav" data-behavior="nav" tabIndex={-1}>
          <div className="g-nav__inner">
            <button className="g-nav__close btn btn--icon-only html4-hidden" type="button" data-nav-hide aria-labelledby="nav-close-title">
              <svg className="icon--close" width={20} height={20}>
                <title id="nav-close-title">Close menu</title>
                <use xlinkHref="#icon--icon_close" />
              </svg>
            </button>
            <form className="g-nav__search" action="/static/pages/search.php" method="get" noValidate data-behavior="FormValidate">
              <div className="form-field__error form-field__error--summary hidden" tabIndex={-1} aria-hidden="true">
                <h3 className="font-bold-heading visuallyhidden">Please correct your errors</h3>
              </div>
              <div className="form-field g-nav__search__form-field">
                <label className="visuallyhidden" htmlFor="search">Search</label>
                <input type="search" name="q" id="search" placeholder="Search" required aria-required="true" aria-describedby="searcherror1" />
                <button className="btn btn--icon-only" type="submit">
                  <span className="visuallyhidden">Go</span>
                  <svg width={26} height={26}>
                    <use xlinkHref="#icon--icon_search" />
                  </svg>
                </button>
                <div aria-hidden="true" className="form-field__error hidden" tabIndex={-1} id="searcherror1">Please enter a search term</div>
              </div>
            </form>
            <h2 className="visuallyhidden" id="g-nav__title">Main menu</h2>
            <nav className="g-nav__links" aria-labelledby="g-nav__title">
              <div className="g-nav__important-links">
                <a className="g-nav__link g-nav__link--important" href="/static/pages/whats-on.php"><span>What’s On</span></a>
                <a className="g-nav__link g-nav__link--important" aria-current="true" href="/static/pages/plan-your-visit.php"><span>Plan your Visit</span></a>
                <a className="g-nav__link g-nav__link--important" href="#"><span>Our Collection</span></a>
                <a className="g-nav__link g-nav__link--important" href="/static/pages/class.php"><span>Take a Class</span></a>
              </div> <a className="g-nav__link" href="/static/pages/about.php"><span>About</span></a>
              <a className="g-nav__link" href="/static/pages/support-individual.php"><span>Join</span></a>
              <a className="g-nav__link" aria-current="true" href="#"><span>Give</span></a>
              <a className="g-nav__link" href="/static/pages/teachers-landing.php"><span>Teachers</span></a>
              <a className="g-nav__link" href="/static/pages/press-landing.php"><span>Press</span></a>
              <a className="g-nav__link" href="#"><span>Shop</span></a>
              <a className="g-nav__link" href="/static/pages/host-an-event.php"><span>Facility Rental</span></a>
              <a className="g-nav__link" href="#"><span>Arboretum</span></a>
            </nav>
          </div>
        </div>
        <div className="g-nav-overlay" data-nav-overlay></div>
      </div>
    );
  }
}

export default SiteHeader;
