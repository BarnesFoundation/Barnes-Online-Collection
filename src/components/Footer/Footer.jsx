import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import PropTypes from 'prop-types';
import axios from 'axios';
import Icon from '../Icon';
import { MoreFromCollection } from '../../components/Footer/MoreFromCollection'
import { MAIN_WEBSITE_DOMAIN, NEWSLETTER_URL, BREAKPOINTS } from '../../constants';
import './footer.css';

const NEWSLETTER_SESSION_STORAGE_KEY = 'isNewsletterSubscribed';
const EMAIL_REGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
const LEAD_SOURCE = 'www-collection-form';

// Enum indicating status of email submission.
const SUBMISSION_STATUS = {
  LOADING: 'LOADING',
  COMPLETE: 'COMPLETE',
};

// Enum indicating status of any error.
const ERROR_STATUS = {
  USER: 'USER',
  SERVER: 'SERVER',
};

/**
 * Newsletter component, stores submission data in localStorage.
 */
class Newsletter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSubmitted: Boolean(sessionStorage.getItem(NEWSLETTER_SESSION_STORAGE_KEY)) ? SUBMISSION_STATUS.COMPLETE : null,
      isError: null,
      value: '',
    };
  }

  /**
   * Submit newsletter subscription.
   */
  submit = async () => {
    const { value } = this.state;

    // If email is valid.
    if (EMAIL_REGEX.test(value)) {
      this.setState({ isSubmitted: SUBMISSION_STATUS.LOADING });

      // Post request to server.
      try {
        await axios.post(NEWSLETTER_URL, { email: value, leadSource: LEAD_SOURCE });
        sessionStorage.setItem(NEWSLETTER_SESSION_STORAGE_KEY, true); // Set session storage in case of page refresh.
        this.setState({ isSubmitted: SUBMISSION_STATUS.COMPLETE });

      // On error, set error status to denote a server error and reset submission status.
      } catch (e) {
        this.setState({ isSubmitted: null, isError: ERROR_STATUS.SERVER });
      }

    // If email is not valid.
    } else {
      this.setState({ isError: ERROR_STATUS.USER });
    }
  }
  
  render() {
    const { isSubmitted, isError } = this.state;

    let processingClass = 'm-newsletter__loading';
    if (isSubmitted !== SUBMISSION_STATUS.LOADING) processingClass = `hidden ${processingClass}`;

    let successClass = 'm-newsletter__success';
    if (isSubmitted !== SUBMISSION_STATUS.COMPLETE) successClass = `hidden ${successClass}`;

    let formClass = 'm-newsletter__signup';
    if (isSubmitted === SUBMISSION_STATUS.COMPLETE) formClass = `hidden ${formClass}`;

    let emailErrorClass = 'form-field__error';
    if (isError !== ERROR_STATUS.USER) emailErrorClass = `hidden ${emailErrorClass}`;

    let serverErrorClass = 'form-field__error';
    if (isError !== ERROR_STATUS.SERVER) serverErrorClass = `hidden ${serverErrorClass}`;

    return (
      <div className='g-footer__subscribe'>
        <h2 className='font-zeta'>Newsletter</h2>
        <div className='m-newsletter'>
          <div className={formClass} aria-hidden={isSubmitted === SUBMISSION_STATUS.COMPLETE}>

            <form className='form-field m-newsletter__field'>
              <label className='visuallyhidden' htmlFor='subscribe'>Enter your email address</label>
              <input
                className='m-newsletter__input input-width'
                type='email'
                name='Email'
                id='subscribe'
                placeholder='email address'
                required aria-required='true'
                aria-describedby='emailerror1'
                onChange={({ target: { value }}) => this.setState({ value })}
              />
              <button
                className='m-newsletter__btn btn btn--icon'
                type='submit'
                onClick={(e) => {
                  e.preventDefault();
                  this.submit();
                }}
              >
                <MediaQuery maxWidth={BREAKPOINTS.mobile_max}>
                  <Icon svgId='-icon_arrow-right' />
                </MediaQuery>
                <MediaQuery minWidth={BREAKPOINTS.mobile_max}>
                  <span className='m-newsletter__wording'>Subscribe</span>
                </MediaQuery>
              </button>
              <input name='formSourceName' value='StandardForm' type='hidden' />
              <input type='hidden' name='sp_exp' value='yes' />
            </form>
          </div>

          {/** Form errors, either user input or server error. */}
          <div
            aria-hidden={isError === ERROR_STATUS.USER}
            className={emailErrorClass}
            role='alert'
            tabIndex='-1'
            id='emailerror1'>
              Enter a valid email address.
          </div>

          <div
            aria-hidden={isError === ERROR_STATUS.SERVER}
            className={serverErrorClass}
            role='alert'
            tabIndex='-1'
            id='emailerror2'>
              Error processing request, please try again later.
          </div>

          {/** Show submission status after submission. */}
          <div
            aria-hidden={isSubmitted !== SUBMISSION_STATUS.LOADING}
            className={processingClass}
            role='alert'>
              Processing your request&hellip;
          </div>
          <div
            aria-hidden={isSubmitted !== SUBMISSION_STATUS.COMPLETE}
            className={successClass}
            role='alert'>
              Thanks for subscribing to our newsletter.
          </div>
        </div>
      </div>
    );
  }
}

/**
 * Footer class, hours section is abled to be removed by not passing hasHours. 
 */
export const Footer = ({ hasHours }) => {
  let gFooterClasses = 'g-footer g-footer--no-border';
  if (!hasHours) gFooterClasses = `${gFooterClasses} no-bottom-margin`;

  return (
    <footer className={gFooterClasses}>
      <MoreFromCollection />
      <div className='container-wrap-fullscreen'>
        <div className='container g-footer__container-top'>
          <div className='m-block m-block--no-border m-block__columns'>
            <div className='m-block__column knight-logo'>
              <p>
                <a href='https://knightfoundation.org/'>
                  <img width={285} src='/images/knight-foundation-logo.svg' alt='knight foundation logo' />
                </a>
              </p>
            </div>
            <div className='m-block__column'>
              <p className='color-medium'>
                The Barnes Foundation collection online is made possible<br className='large-only' /> by generous support from The John S. and James L. Knight Foundation.
              </p>
              <p className='color-medium no-margin-top'>
                Ongoing work continues through the Knight Center for Digital Innovation in Audience Engagement at the Barnes.
              </p>
              <div className='brand-links'>
                <a className='a-brand-link a-brand-link-on-grey a-brand-link--block brand-links__link' href='https://www.barnesfoundation.org/collection/credits'>Project Credits</a>
                <a className='a-brand-link a-brand-link-on-grey a-brand-link--block brand-links__link' href='https://www.barnesfoundation.org/collection/open-access-and-copyright'>Open Access</a>
                <a className='a-brand-link a-brand-link-on-grey a-brand-link--block brand-links__link' href='https://www.barnesfoundation.org/copyright-and-image-licensing'>Image Licensing</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {hasHours && <div className='container'>
        <div className='g-footer__actions m-block m-block--no-border'>
          <div className='g-footer__col'>
            <div className='g-footer__cta'>
              <div className='font-delta g-footer__cta-title'><p><strong>Your support helps</strong><strong> research and conservation at the Barnes, so we can present exhibitions and events.</strong></p></div>
              <div className='m-btn-group'>
                <a className='btn btn--100' href='https://tickets.barnesfoundation.org/orders/316/tickets'>Donate</a>
                <a className='btn btn--100' href='https://www.barnesfoundation.org/support/membership'>Become a Member</a>
              </div>
            </div>
          </div>
          <div className='g-footer__col g-footer__details'>
            <div className='vcard g-footer__address'>
              <h2 className='font-zeta footer-detail'>Location</h2>
              <p className='adr'>
                <span className='street-address'>2025 Benjamin Franklin Parkway</span><br />
                <span className='locality'>Philadelphia</span>, <span className='region'>PA</span> <span className='postcode'>19130</span><br />
                Phone: <span className='tel'>215-278-7000</span>
                <a className='a-brand-link g-footer__address__link' href='https://www.google.com/maps?cid=5415126767940621792'>Get directions</a>
              </p>
            </div>
            <div className='g-footer__hours'>
              <h2 className='font-zeta footer-detail'>Hours</h2>
              <p>Wed–Mon: 11am – 5pm<br />Closed Tuesdays <br />Closed Thanksgiving, Christmas, New Year's Day, and July 4th</p>
            </div>
            <Newsletter />
          </div>
        </div>
        <div className='g-footer__auxiliary'>
          <nav className='g-footer__nav' aria-labelledby='footernav-heading'>
            <h2 id='footernav-heading' className='visuallyhidden'>Useful links</h2>
            <a className='g-footer__nav__link' href={MAIN_WEBSITE_DOMAIN + '/accessibility'}>
              Accessibility
            </a>

            <a className='g-footer__nav__link' href={MAIN_WEBSITE_DOMAIN + '/terms'}>
              Terms &amp; Conditions
            </a>
            <a className='g-footer__nav__link' href={MAIN_WEBSITE_DOMAIN + '/privacy-policy'}>
              Privacy Policy
            </a>

            {/* TODO => Add updated link. */}
            <a className='g-footer__nav__link' href={MAIN_WEBSITE_DOMAIN + '/non-discrimination'}>
              Non-discrimination
            </a>

            <a className='g-footer__nav__link' href={MAIN_WEBSITE_DOMAIN + '/copyright-and-image-licensing'}>
              Copyright &amp; Image Licensing
            </a>
          </nav>
          <div className='g-footer__social-container'>
            <nav className='g-footer__social' aria-labelledby='socialnav-heading'>
              <h2 id='socialnav-heading' className='visuallyhidden'>Find us on social media</h2>
              <a className='g-footer__social__link' href='http://www.facebook.com/barnesfoundation'>
                <svg width={20} height={20}><title>facebook</title><use xlinkHref='#icon--icon_facebook' /></svg>
              </a>
              <a className='g-footer__social__link' href='https://twitter.com/the_barnes'>
                <svg width={20} height={20}><title>twitter</title><use xlinkHref='#icon--icon_twitter' /></svg>
              </a>
              <a className='g-footer__social__link' href='http://www.youtube.com/barnesfoundation'>
                <svg width={20} height={20}><title>youtube</title><use xlinkHref='#icon--icon_youtube' /></svg>
              </a>
              <a className='g-footer__social__link' href='https://instagram.com/barnesfoundation/'>
                <svg width={20} height={20}><title>instagram</title><use xlinkHref='#icon--icon_instagram' /></svg>
              </a>
            </nav>
            <a className='g-footer__a17' href='http://area17.com/?utm_source=http%3A%2F%2Fwww.barnesfoundation.org%2F&utm_medium=referral&utm_campaign=footer-credit-2016'>Site by AREA 17</a>
          </div>
        </div>
      </div>}
    </footer>
  );
};

Footer.propTypes = {
  hasHours: PropTypes.bool
};

export default Footer;
