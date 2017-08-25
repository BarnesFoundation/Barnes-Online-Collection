import React, { Component } from 'react';
import './footer.css';

class Footer extends Component {

  handleSubmitNewsletter(e) {
    e.preventDefault();
    // todo: #newsletterForm handle this
  }

  render() {
    return (
      <footer className="g-footer">
        <div className="container">

          <div className="g-footer__col g-footer__details">
          test
          </div>

          <div className="m-block__columns">
            <div className="m-block__column g-footer__donate">
              <h4 className="h4 font-delta">Your support helps research and conservation at the Barnes, so we can present our exhibitions and events.</h4>
              <div className="m-btn-group">
                <a className="btn" href="https://tickets.barnesfoundation.org/orders/316/tickets">Donate</a>
                <a className="btn" href="https://www.barnesfoundation.org/support/membership">Become a Member</a>
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
                <p>Wed — Mon: 10am – 5pm<br />First Friday: 6 – 9pm<br />Tuesday closed</p>
              </div>
              {/* todo: #newsletterForm hide the form for now. We need to know where to submit this */}
              {/*
              <div className="g-footer__subscribe">
                <h2 className="font-zeta">Newsletter</h2>
                <form
                  className="m-newsletter"
                  action="https://www.barnesfoundation.org/newsletter-signup"
                  id="newsletterForm"
                  method="post"
                  acceptCharset="UTF-8"
                  noValidate
                  data-behavior="Newsletter FormValidate"
                  onSubmit={this.handleSubmitNewsletter.bind(this)}
                >
                  <div className="m-newsletter__signup" aria-hidden="false">
                    <input type="hidden" name="CRAFT_CSRF_TOKEN" defaultValue="vQoQcqEj5g0kfxLCcH1Hx5wJbEjTSLzRaOlPFcXa" />
                    <input type="hidden" name="action" defaultValue="mailchimpSubscribe/list/Subscribe" />
                    <input type="hidden" name="redirect" defaultValue="?success=true#newsletterForm" />
                    <div className="form-field__error form-field__error--summary hidden" tabIndex={-1} aria-hidden="true">
                      <h3 className="font-bold-heading visuallyhidden">Please correct your errors</h3>
                    </div>
                    <div className="form-field m-newsletter__field">
                      <label className="visuallyhidden" htmlFor="email">Enter your e-mail address</label>
                      <input id="email" name="email" className="m-newsletter__input" type="email" placeholder="email address" required aria-required="true" aria-describedby="emailerror1" />
                      <button className="m-newsletter__btn btn" type="submit">
                        <span className="m-newsletter__wording">Subscribe</span>
                        <span className="m-newsletter__icon">
                          <svg width={13} height={20} aria-label="Subscribe"><use xlinkHref="#icon--icon_arrow-right" /></svg>
                        </span>
                      </button>
                      <div aria-hidden="true" className="form-field__error hidden" role="alert" tabIndex={-1} id="emailerror1">Please enter a valid email address</div>
                      <span style={{opacity: 1, backgroundSize: '19px 13px', left: 1038, top: '251.5px', width: 19, minWidth: 19, height: 13, position: 'absolute', backgroundImage: 'url("data:image/png', backgroundRepeat: 'no-repeat', backgroundPosition: '0px 0px', border: 'none', display: 'inline', visibility: 'visible', zIndex: 'auto'}} /></div>
                  </div>
                  <div aria-hidden="true" className="hidden m-newsletter__loading" role="alert">
                    Processing your request…
                  </div>
                  <div aria-hidden="true" className="hidden m-newsletter__success" role="alert">
                    Thanks for subscribing to our newsletter
                  </div>
                </form>
              </div>
              */}
            </div>
          </div>
          <div className="g-footer__auxiliary">
            <nav className="g-footer__nav" aria-labelledby="footernav-heading">
              <h2 id="footernav-heading" className="visuallyhidden">Useful links</h2>
              <a className="g-footer__nav__link" href="https://www.barnesfoundation.org/">
                © 2017 Barnes Foundation
              </a>
              <a className="g-footer__nav__link" href="https://www.barnesfoundation.org/terms">
                Terms &amp; Conditions
              </a>
              <a className="g-footer__nav__link" href="https://www.barnesfoundation.org/privacy-policy">
                Privacy Statement
              </a>
              <a className="g-footer__nav__link" href="https://www.barnesfoundation.org/accessibility">
                Accessibility
              </a>
              <a className="g-footer__nav__link" href="https://www.barnesfoundation.org/about">
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
