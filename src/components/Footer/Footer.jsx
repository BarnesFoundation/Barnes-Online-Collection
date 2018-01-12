import React, { Component } from 'react';
import {MAIN_WEBSITE_DOMAIN} from '../../constants';
import './footer.css';

class Footer extends Component {

  handleSubmitNewsletter(e) {
    e.preventDefault();
    // todo: #newsletterForm handle this
  }

  render() {
    return (
      <footer className="g-footer g-footer--no-border g-footer--flush-top">
        <div className="container-wrap-fullscreen">
          <div className="container g-footer__container-top">
            <div className="m-block m-block--no-border m-block__columns">
              <div className="m-block__column">
                <p className="color-medium">
                  The Barnes Foundation collection online is made possible<br className="large-only" /> by generous support from The John S. and James L. Knight Foundation.
                </p>
                <p>
                  <a href="https://knightfoundation.org/">
                    <img width={285} src="/images/knight-foundation-logo.svg" alt="knight foundation logo" />
                  </a>
                </p>
              </div>
              <div className="m-block__column">
                <div className="m-block__columns">
                  <div className="m-block__column">
                    <a className="a-brand-link a-brand-link-on-grey a-brand-link--block" href="https://www.barnesfoundation.org/collection/credits">Project Credits</a>
                    <a className="a-brand-link a-brand-link-on-grey a-brand-link--block" href="https://www.barnesfoundation.org/collection/open-access-and-copyright">Open Access</a>
                    <a className="a-brand-link a-brand-link-on-grey a-brand-link--block" href="https://www.barnesfoundation.org/copyright-and-image-licensing">Image Licensing</a>
                  </div>
                  <div className="m-block__column">
                    <a className="a-brand-link a-brand-link-on-grey a-brand-link--block" href="https://www.barnesfoundation.org/whats-on/collection">Collection History</a>
                    <a className="a-brand-link a-brand-link-on-grey a-brand-link--block" href="https://www.barnesfoundation.org/whats-on/collection/library-archives">Archives and Special Collections</a>
                    <a className="a-brand-link a-brand-link-on-grey a-brand-link--block" href="https://www.barnesfoundation.org/whats-on/arboretum">Plant Collections</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="m-block m-block--no-border m-block__columns">
            <div className="m-block__column g-footer__donate">
              <h4 className="h4 font-delta">Your support helps research and conservation at the Barnes, so we can present our exhibitions and events.</h4>
              <div className="m-btn-group">
                <a className="btn" href="https://tickets.barnesfoundation.org/orders/316/tickets">Donate</a>
                <a className="btn" href={MAIN_WEBSITE_DOMAIN + '/support/membership'}>Become a Member</a>
              </div>
            </div>
            <div className="m-block__column g-footer__details color-medium">
              <div className="vcard g-footer__address">
                <h2 className="h2 font-zeta">Location</h2>
                <p className="adr">
                  <span className="street-address">2025 Benjamin Franklin Parkway</span><br />
                  <span className="locality">Philadelphia</span>, <span className="region">PA</span> <span className="postcode">19130</span><br />
                  Phone: <span className="tel">215-278-7000</span>
                  <a className="a-brand-link g-footer__address__link" href="https://www.google.com/maps?cid=5415126767940621792">Map</a>
                </p>
              </div>
              <div className="g-footer__hours">
                <h2 className="h2 font-zeta">Hours</h2>
                <p>Wed–Mon: 11am–5pm<br />Closed Tuesdays</p>
              </div>
            </div>
          </div>
          <div className="g-footer__auxiliary">
            <nav className="g-footer__nav" aria-labelledby="footernav-heading">
              <h2 id="footernav-heading" className="visuallyhidden">Useful links</h2>
              <a className="g-footer__nav__link" href={MAIN_WEBSITE_DOMAIN + '/'}>
                © 2017 Barnes Foundation
              </a>
              <a className="g-footer__nav__link" href={MAIN_WEBSITE_DOMAIN + '/terms'}>
                Terms &amp; Conditions
              </a>
              <a className="g-footer__nav__link" href={MAIN_WEBSITE_DOMAIN + '/privacy-policy'}>
                Privacy Statement
              </a>
              <a className="g-footer__nav__link" href={MAIN_WEBSITE_DOMAIN + '/accessibility'}>
                Accessibility
              </a>
              <a className="g-footer__nav__link" href={MAIN_WEBSITE_DOMAIN + '/about'}>
                Contact
              </a>
            </nav>
            <div className="g-footer__social-container">
              <nav className="g-footer__social" aria-labelledby="socialnav-heading">
                <h2 id="socialnav-heading" className="visuallyhidden">Find us on social media</h2>
                <a className="g-footer__social__link" href="https://twitter.com/the_barnes">
                  <svg width={20} height={20}><title>twitter</title><use xlinkHref="#icon--icon_twitter" /></svg>
                </a>
                <a className="g-footer__social__link" href="http://www.facebook.com/barnesfoundation">
                  <svg width={20} height={20}><title>facebook</title><use xlinkHref="#icon--icon_facebook" /></svg>
                </a>
                <a className="g-footer__social__link" href="http://www.youtube.com/barnesfoundation">
                  <svg width={20} height={20}><title>youtube</title><use xlinkHref="#icon--icon_youtube" /></svg>
                </a>
                <a className="g-footer__social__link" href="https://instagram.com/barnesfoundation/">
                  <svg width={20} height={20}><title>instagram</title><use xlinkHref="#icon--icon_instagram" /></svg>
                </a>
              </nav>
              <a className="g-footer__a17" href="http://area17.com/?utm_source=http%3A%2F%2Fwww.barnesfoundation.org%2F&utm_medium=referral&utm_campaign=footer-credit-2016">Site by AREA 17</a>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
