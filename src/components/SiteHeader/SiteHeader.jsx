import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import SiteNavSidebar from '../../components-barnes-toolkit/components/nav/Nav.jsx';
import * as Actions from '../../actions/htmlClassManager';
import {MAIN_WEBSITE_DOMAIN} from '../../constants';

class SiteHeader extends Component {

  handleNavBtnClick(e) {
    e.preventDefault();
    this.props.htmlClassesToggle('nav-active');
  }

  render() {
    return (
      <div>
        <header className="g-header" data-behavior="header">
          <div className="container">
            <a className="a-logo g-header__logo" href={MAIN_WEBSITE_DOMAIN}>
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
              <a className="g-header__nav__link" href={MAIN_WEBSITE_DOMAIN + '/whats-on'}>What’s On</a>
              <a className="g-header__nav__link" href={MAIN_WEBSITE_DOMAIN + '/plan-your-visit'}>Plan your Visit</a>
              <a className="g-header__nav__link" href="/">Our Collection</a>
              <a className="g-header__nav__link" href={MAIN_WEBSITE_DOMAIN + '/classes'}>Take a Class</a>
              <a
                href={MAIN_WEBSITE_DOMAIN + '/search'}
                className="g-header__nav__btn btn btn--icon-only html4-hidden"
              >
                <svg width="26" height="26">
                  <title id="search-open-title">Search</title>
                  <use xlinkHref="#icon--icon_search"></use>
                </svg>
              </a>
              <button
                onClick={this.handleNavBtnClick.bind(this)}
                className="g-header__nav__btn btn btn--icon-only html4-hidden"
                data-nav-show
                type="button"
                aria-labelledby="nav-open-title"
              >
                <svg width="26" height="26">
                  <title id="nav-open-title">Menu</title>
                  <use xlinkHref="#icon--icon_menu"></use>
                </svg>
              </button>
            </nav>
          </div>
          <div className="m-search-bar" data-behavior="SearchBar" aria-hidden="true">
            <div className="container">
              <form className="m-search-bar__form" action="/static/pages/search.php" method="get" noValidate data-behavior="FormValidate">
                <div className="form-field__error form-field__error--summary hidden" tabIndex="-1" aria-hidden="true">
                  <h3 className="font-bold-heading">Please correct your errors</h3>
                </div>
                <div className="form-field m-search-bar__form-field">
                  <label className="visuallyhidden" htmlFor="search">Search</label>
                  <input className="input" type="search" name="q" id="search" placeholder="Search" required aria-required="true" aria-describedby="searcherror1" />
                  <button className="btn btn--primary" type="submit">
                    Search
                  </button>
                  <div aria-hidden="true" className="form-field__error hidden" tabIndex="-1" id="searcherror1">Enter a search term</div>
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
        <SiteNavSidebar />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    htmlClassManager: state.htmlClassManager,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign(
    {},
    Actions
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SiteHeader);
