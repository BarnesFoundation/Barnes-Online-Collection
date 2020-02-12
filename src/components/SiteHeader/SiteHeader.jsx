import React, { Component } from 'react';
import { SideMenu } from '../SideMenu/SideMenu';
import { MAIN_WEBSITE_DOMAIN } from '../../constants';
import './siteHeader.css';

export class SiteHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSideMenuOpen: false,
    };
  }

  handleNavBtnClick(e) {
    e.preventDefault();
    this.setState({ isSideMenuOpen: true });
  }

  render() {
    // Define class to change color of header and padding.
    const isArtObjectClassNames = this.props.isArtObject ? 'art-object-header' : null;

    return (
      <div className={isArtObjectClassNames}>
        <header className='g-header' data-behavior='header'>
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
              <a className='g-header__nav__link' aria-current='true' href='/'>Our Collection</a>
              <a className='g-header__nav__link' href={MAIN_WEBSITE_DOMAIN + '/classes'}>Take a Class</a>
              <a
                href={MAIN_WEBSITE_DOMAIN + '/search'}
                className='g-header__nav__btn g-header__btn__search btn btn--icon-only html4-hidden'
              >
                <svg width='26' height='26'>
                  <title id='search-open-title'>Search</title>
                  <use xlinkHref='#icon--icon_search'></use>
                </svg>
              </a>
              <button
                onClick={this.handleNavBtnClick.bind(this)}
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
        </header>
        <SideMenu
          closeMenu={() => this.setState({ isSideMenuOpen: false })}
          isOpen={this.state.isSideMenuOpen}
        />
      </div>
    );
  }
};
