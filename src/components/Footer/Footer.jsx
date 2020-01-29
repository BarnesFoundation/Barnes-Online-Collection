import React from 'react';
import MediaQuery from 'react-responsive';
import Icon from '../Icon'; 
import { MAIN_WEBSITE_DOMAIN, BREAKPOINTS } from '../../constants';
import './footer.css';

export const Footer = () => (
  <footer className="g-footer g-footer--no-border">
    <div className="container-wrap-fullscreen">
      <div className="container g-footer__container-top">
        <div className="m-block m-block--no-border m-block__columns">
          <div className="m-block__column knight-logo">
            <p>
              <a href="https://knightfoundation.org/">
                <img width={285} src="/images/knight-foundation-logo.svg" alt="knight foundation logo" />
              </a>
            </p>
          </div>
          <div className="m-block__column">
            <p className="color-medium">
              The Barnes Foundation collection online is made possible<br className="large-only" /> by generous support from The John S. and James L. Knight Foundation. 
            </p>
            <p className="color-medium no-margin-top">
              Ongoing work continues through the Knight Center for Digital Innovation in Audience Engagement at the Barnes.
            </p>
            {/* <div className="m-block__columns"> */}
              <div className="brand-links">
                <a className="a-brand-link a-brand-link-on-grey a-brand-link--block" href="https://www.barnesfoundation.org/collection/credits">Project Credits</a>
                <a className="a-brand-link a-brand-link-on-grey a-brand-link--block" href="https://www.barnesfoundation.org/collection/open-access-and-copyright">Open Access</a>
                <a className="a-brand-link a-brand-link-on-grey a-brand-link--block" href="https://www.barnesfoundation.org/copyright-and-image-licensing">Image Licensing</a>
              </div>
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
    <div className="container">
      <div className="g-footer__actions m-block m-block--no-border">
        <div className="g-footer__col">
          <div className="g-footer__cta">
            <div className="font-delta g-footer__cta-title"><p><strong>Your support helps</strong><strong> research and conservation at the Barnes, so we can present exhibitions and events.</strong></p></div>
            <div className="m-btn-group">
                <a className="btn btn--100" href="https://tickets.barnesfoundation.org/orders/316/tickets">Donate</a>
                <a className="btn btn--100" href="/support/membership">Become a Member</a>
            </div>
          </div>
        </div>
        <div className="g-footer__col g-footer__details">
          <div className="vcard g-footer__address">
            <h2 className="font-zeta footer-detail">Location</h2>
            <p className="adr">
              <span className="street-address">2025 Benjamin Franklin Parkway</span><br />
              <span className="locality">Philadelphia</span>, <span className="region">PA</span> <span className="postcode">19130</span><br />
              Phone: <span className="tel">215-278-7000</span>
              <a className="a-brand-link g-footer__address__link" href="https://www.google.com/maps?cid=5415126767940621792">Get directions</a>
            </p>
          </div>
          <div className="g-footer__hours">
            <h2 className="font-zeta footer-detail">Hours</h2>
            <p>Wed–Mon: 11am–5pm<br />Closed Tuesdays <br />Closed Thanksgiving, Christmas, New Year's Day, and July 4th</p>
          </div>
          <div className='g-footer__subscribe'>
            <h2 className="font-zeta">Newsletter</h2>
            <form className="m-newsletter" action="//www.pages03.net/thebarnesfoundation/EmailPreferences/Opt-In?vs=YTg4NTA4MTAtNjcwZS00MjRmLTg2M2QtNDhlZjQ0OGUxN2ExOzsS1" method="post" novalidate data-behavior="Newsletter FormValidate">
              <div className="m-newsletter__signup" aria-hidden="false">
                <div className="form-field__error form-field__error--summary hidden" tabindex="-1" aria-hidden="true">
                  <h3 className="font-bold-heading visuallyhidden">Please correct your errors</h3>
                </div>
                <div className="form-field m-newsletter__field">
                  <label className="visuallyhidden" for="subscribe">Enter your email address</label>
                  <input className="m-newsletter__input" type="email" name="Email" id="subscribe" placeholder="email address" required aria-required="true" aria-describedby="emailerror1" />
                  <button className="m-newsletter__btn btn" type="submit">
                    <MediaQuery maxWidth={BREAKPOINTS.mobile_max}>
                      <Icon svgId='tool_space' />
                    </MediaQuery>
                    <Icon />
                    <MediaQuery minWidth={BREAKPOINTS.tablet_max}>
                      {/* <span className="m-newsletter__wording">Subscribe</span> */}
                    </MediaQuery>
                  </button>
                  <div aria-hidden="true" className="form-field__error hidden" role="alert" tabindex="-1" id="emailerror1">
                    Enter a valid email address
                  </div>
                  <input name="formSourceName" value="StandardForm" type="hidden" />
                  <input type="hidden" name="sp_exp" value="yes" />
                </div>
              </div>
              <div aria-hidden="true" className="hidden font-delta m-newsletter__loading" role="alert">
                Processing your request&hellip;
              </div>
              <div aria-hidden="true" className="hidden font-delta color-brand m-newsletter__success" role="alert">
                Thanks for subscribing to our newsletter
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="g-footer__auxiliary">
        <nav className="g-footer__nav" aria-labelledby="footernav-heading">
          <h2 id="footernav-heading" className="visuallyhidden">Useful links</h2>
          <a className="g-footer__nav__link" href={MAIN_WEBSITE_DOMAIN + '/accessibility'}>
            Accessibility
          </a>
          
          <a className="g-footer__nav__link" href={MAIN_WEBSITE_DOMAIN + '/terms'}>
            Terms &amp; Conditions
          </a>
          <a className="g-footer__nav__link" href={MAIN_WEBSITE_DOMAIN + '/privacy-policy'}>
            Privacy Policy
          </a>
          
          {/* TODO => Add updated link. */}
          <a className="g-footer__nav__link" href={MAIN_WEBSITE_DOMAIN + '/about'}>
            Non-descrimination
          </a>

          <a className="g-footer__nav__link" href={MAIN_WEBSITE_DOMAIN + '/'}>
            Copywrite &amp; Image Licensing
          </a>
        </nav>
        <div className="g-footer__social-container">
          <nav className="g-footer__social" aria-labelledby="socialnav-heading">
            <h2 id="socialnav-heading" className="visuallyhidden">Find us on social media</h2>
            <a className="g-footer__social__link" href="http://www.facebook.com/barnesfoundation">
              <svg width={20} height={20}><title>facebook</title><use xlinkHref="#icon--icon_facebook" /></svg>
            </a>
            <a className="g-footer__social__link" href="https://twitter.com/the_barnes">
              <svg width={20} height={20}><title>twitter</title><use xlinkHref="#icon--icon_twitter" /></svg>
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

export default Footer;
