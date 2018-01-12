import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as HtmlClassManagerActions from '../../../actions/htmlClassManager';
import { MAIN_WEBSITE_DOMAIN, CLASSNAME_NAV_ACTIVE} from '../../../constants';

class SiteHeader extends Component {
  constructor(props) {
    super(props);

    this.handleNavCloseBtnClick = this.handleNavCloseBtnClick.bind(this);
  }

  handleNavCloseBtnClick(e) {
    e.preventDefault();
    this.props.htmlClassesRemove(CLASSNAME_NAV_ACTIVE);
  }

  render() {
    return (
      <div>
        <div
          className="g-nav"
          data-behavior="nav"
          tabIndex={-1}
        >
          <div className="g-nav__inner">
            <button
              onClick={this.handleNavCloseBtnClick}
              className="g-nav__close btn btn--icon-only html4-hidden"
              type="button"
              aria-labelledby="nav-close-title"
              data-nav-hide
            >
              <svg className="icon--close" width={20} height={20}>
                <title id="nav-close-title">Close menu</title>
                <use xlinkHref="#icon--icon_close" />
              </svg>
            </button>
            {/*Hidden on collections site*/}
            {/*
            <form className="g-nav__search" action="/static/pages/search" method="get" noValidate data-behavior="FormValidate">
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
            */}
            <h2 className="visuallyhidden" id="g-nav__title">Main menu</h2>
            <nav className="g-nav__links" aria-labelledby="g-nav__title">
              <div className="g-nav__important-links">
                <a
                  className="g-nav__link g-nav__link--important"
                  href={MAIN_WEBSITE_DOMAIN + '/static/pages/whats-on'}
                >
                  <span>What’s On</span>
                </a>
                <a
                  className="g-nav__link g-nav__link--important"
                  href={MAIN_WEBSITE_DOMAIN + '/static/pages/plan-your-visit'}
                >
                  <span>Plan your Visit</span>
                </a>
                <a
                  className="g-nav__link g-nav__link--important" aria-current="true"
                  href="/"
                >
                  <span>Our Collection</span>
                </a>
                <a
                  className="g-nav__link g-nav__link--important"
                  href={MAIN_WEBSITE_DOMAIN + '/static/pages/class'}
                >
                  <span>Take a Class</span>
                </a>
              </div>
              <a
                className="g-nav__link"
                href={MAIN_WEBSITE_DOMAIN + '/static/pages/about'}
              >
                <span>About</span>
              </a>
              <a
                className="g-nav__link"
                href={MAIN_WEBSITE_DOMAIN + '/static/pages/support-individual'}
              >
                <span>Join</span>
              </a>
              <a
                className="g-nav__link"
                href={MAIN_WEBSITE_DOMAIN + '/'}
              >
                <span>Give</span>
              </a>
              <a
                className="g-nav__link"
                href={MAIN_WEBSITE_DOMAIN + '/static/pages/teachers-landing'}
              >
                <span>Teachers</span>
              </a>
              <a
                className="g-nav__link"
                href={MAIN_WEBSITE_DOMAIN + '/static/pages/press-landing'}
              >
                <span>Press</span>
              </a>
              <a
                className="g-nav__link"
                href={MAIN_WEBSITE_DOMAIN + '/'}
              >
                <span>Shop</span>
              </a>
              <a
                className="g-nav__link"
                href={MAIN_WEBSITE_DOMAIN + '/static/pages/host-an-event'}
              >
                <span>Facility Rental</span>
              </a>
              <a
                className="g-nav__link"
                href={MAIN_WEBSITE_DOMAIN + '/'}
              >
                <span>Arboretum</span>
              </a>
            </nav>
          </div>
        </div>
        <div
          onClick={this.handleNavCloseBtnClick}
          className="g-nav-overlay"
          data-nav-overlay
        ></div>
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
    HtmlClassManagerActions
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SiteHeader);
