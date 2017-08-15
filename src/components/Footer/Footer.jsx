import React, { Component } from 'react';

class Footer extends Component {
  render() {
    return (
      <footer className="g-footer g-footer--shopify">
        <a name="footer" />
        <div className="container">
          {/* Footer actions */}
          <div className="g-footer__actions">
            <div className="g-footer__col g-footer__details">
              <div className="vcard g-footer__address">
                <h2 className="font-zeta">Location</h2>
                <p className="adr">
                  <span className="street-address">2025 Benjamin Franklin Parkway</span><br />
                  <span className="locality">Philadelphia</span>, <span className="region">PA</span> <span className="postcode">19130</span><br />
                  Phone: <span className="tel">215-278-7000</span>
                  <a className="a-brand-link g-footer__address__link" href="https://www.google.com/maps?cid=5415126767940621792">Get directions</a>
                </p>
              </div>
              <div className="g-footer__hours">
                <h2 className="font-zeta">Hours</h2>
                <p>Wed — Mon: 10am – 5pm<br />First Friday: 6 – 9pm<br />Tuesday closed</p>
              </div>
            </div>
            <div className="g-footer__col">
              {/* Footer nav */}
              <div className="g-footer__subscribe">
                <h2 className="font-zeta" id="footer-nav-title">Info</h2>
                <nav className="g-footer__info-links" aria-labelledby="footer-nav-title">
                  <a href="/search" className="g-footer__info-links__item">Search</a>
                </nav>
              </div>
              {/*/ Footer nav */}
            </div>
          </div>
          {/*/ Footer actions */}
          {/* Footer auxiliary */}
          <div className="g-footer__auxiliary">
            <div className="g-footer__social-container">
              <div className>
                Copyright © 2017 <a href="/" title>Barnes Foundation</a>
              </div>
              <nav className="g-footer__social" aria-labelledby="socialnav-heading">
                <h2 id="socialnav-heading" className="visuallyhidden">Find us on social media</h2>
                <a className="g-footer__social__link" href="https://twitter.com/the_barnes">
                  <svg width={20} height={20}><title>Twitter</title><use xlinkHref="#icon--icon_twitter" /></svg>
                </a>
                <a className="g-footer__social__link" href="http://www.facebook.com/barnesfoundation">
                  <svg width={20} height={20}><title>Facebook</title><use xlinkHref="#icon--icon_facebook" /></svg>
                </a>
                <a className="g-footer__social__link" href="http://www.youtube.com/barnesfoundation">
                  <svg width={20} height={20}><title>YouTube</title><use xlinkHref="#icon--icon_youtube" /></svg>
                </a>
                <a className="g-footer__social__link" href="https://instagram.com/barnesfoundation/">
                  <svg width={20} height={20}><title>Instagram</title><use xlinkHref="#icon--icon_instagram" /></svg>
                </a>
              </nav>
            </div>
          </div>
          {/*/ Footer auxiliary */}
        </div>
      </footer>
    );
  }
}

export default Footer;
