import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { LockScroll } from '../LockScroll';
import { htmlClassesRemove } from '../../actions/htmlClassManager';
import { MAIN_WEBSITE_DOMAIN } from '../../constants';
import './SideMenu.css';

/**
 * Default side menu for navigation.
 * If there is children for @see SideMenu.jsx, this is not rendered.
 */
const DefaultSideMenu = () => (
  <nav className='g-nav__links' aria-labelledby='g-nav__title'>
    <div className='g-nav__important-links'>
      <a
        className='g-nav__link g-nav__link--important'
        href={MAIN_WEBSITE_DOMAIN + '/whats-on'}
      >
        <span>What’s On</span>
      </a>
      <a
        className='g-nav__link g-nav__link--important'
        href={MAIN_WEBSITE_DOMAIN + '/plan-your-visit'}
      >
        <span>Plan your Visit</span>
      </a>
      <a
        className='g-nav__link g-nav__link--important' aria-current='true'
        href='/'
      >
        <span>Our Collection</span>
      </a>
      <a
        className='g-nav__link g-nav__link--important'
        href={MAIN_WEBSITE_DOMAIN + '/classes'}
      >
        <span>Take a Class</span>
      </a>
    </div>
    <a
      className='g-nav__link'
      href={MAIN_WEBSITE_DOMAIN + '/about'}
    >
      <span>About</span>
    </a>
    <a
      className='g-nav__link'
      href={MAIN_WEBSITE_DOMAIN + '/support'}
    >
      <span>Support</span>
    </a>
    {/* <a
      className='g-nav__link'
      href={MAIN_WEBSITE_DOMAIN + '/support/individual-giving'}
    >
      <span>Give</span>
    </a> */}
    <a
      className='g-nav__link'
      href={MAIN_WEBSITE_DOMAIN + '/teachers'}
    >
      <span>Teachers</span>
    </a>
    <a
      className='g-nav__link'
      href={MAIN_WEBSITE_DOMAIN + '/about/careers-and-volunteering'}
    >
      <span>Careers</span>
    </a>
    <a
      className='g-nav__link'
      href={MAIN_WEBSITE_DOMAIN + '/press'}
    >
      <span>Press</span>
    </a>
    <a
      className='g-nav__link'
      href={'https://shop.barnesfoundation.org/'}
    >
      <span>Shop</span>
    </a>
    <a
      className='g-nav__link'
      href={MAIN_WEBSITE_DOMAIN + '/host-an-event'}
    >
      <span>Host an Event</span>
    </a>
    <a
      className='g-nav__link'
      href={MAIN_WEBSITE_DOMAIN + `/whats-on/arboretum`}
    >
      <span>Arboretum</span>
    </a>
  </nav>
);

// Representations of the different states possible for the overlay.
// The additional state of TRANSITION in necessary to keep the width of the overlay for the opacity animation to complete.
const OVERLAY_STATES = {
  ACTIVE: 'ACTIVE',
  TRANSITION: 'TRANSITION',
  INACTIVE: 'INACTIVE',
}

/**
 * Side menu component.
 */
class SideMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOverlayActive: OVERLAY_STATES.INACTIVE,
    };

    this.sto = null; 
  }

  /**
   * Check if isOpen has changed, if it has then alter the transition state for the overlay.
   * @param {React.Props} prevProps 
   */
  componentDidUpdate(prevProps) {
    if (prevProps.isOpen !== this.props.isOpen) {
      if (this.props.isOpen) {
        this.setState({ isOverlayActive: OVERLAY_STATES.ACTIVE });
      } else {
        // Set to transition state if menu has been closed.
        this.setState({ isOverlayActive: OVERLAY_STATES.TRANSITION });

        this.sto = setTimeout(() => {
          this.setState({ isOverlayActive: OVERLAY_STATES.INACTIVE });
        }, 500); // This is the animation time.
      }
    }
  }

  /**
   * On unmount: if setTimeout exists, clear it.
   */
  componentWillUnmount() {
    if (this.sto) clearTimeout(this.sto);
  }

  render() {
    const { closeMenu, isOpen, children, setRef } = this.props;
    const { isOverlayActive } = this.state;
    
    const handleNavCloseBtnClick = (e) => {
      e.preventDefault();
      closeMenu();
    };

    let sideMenuClassNames = 'side-menu';
    if (isOpen) sideMenuClassNames = `${sideMenuClassNames} side-menu--active`;

    let gNavClassNames = 'g-nav';
    if (children) gNavClassNames = `${gNavClassNames} g-nav--custom`;
    if (isOpen) gNavClassNames = `${gNavClassNames} g-nav--active`;

    let gNavOverlayClassNames = 'g-nav-overlay';
    if (isOverlayActive === OVERLAY_STATES.ACTIVE || isOverlayActive === OVERLAY_STATES.TRANSITION) gNavOverlayClassNames = `${gNavOverlayClassNames} g-nav-overlay--transition`;
    if (isOverlayActive === OVERLAY_STATES.ACTIVE) gNavOverlayClassNames = `${gNavOverlayClassNames} g-nav-overlay--active`;

    // Prevent cancellation from propagating in Dropdowns.jsx.
    const additionalProps = {};
    if (children) {
      additionalProps.onClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
      };
    }

    if (setRef) {
      additionalProps.ref = setRef;
    }

    return (
      <div className={sideMenuClassNames}>
        <div
          className={gNavClassNames}
          data-behavior='nav'
          tabIndex={-1}
        >
          <div
            className='g-nav__inner'
            {...additionalProps}
          >
            <button
              onClick={handleNavCloseBtnClick}
              className='g-nav__close btn btn--icon-only html4-hidden'
              type='button'
              aria-labelledby='nav-close-title'
              data-nav-hide
            >
              <svg className='icon--close' width={20} height={20}>
                <title id='nav-close-title'>Close menu</title>
                <use xlinkHref='#icon--icon_close' />
              </svg>
            </button>
            <h2 className='visuallyhidden' id='g-nav__title'>Main menu</h2>
            {children || <DefaultSideMenu />}
          </div>
        </div>
        <div
          onClick={handleNavCloseBtnClick}
          className={gNavOverlayClassNames}
          data-nav-overlay
        ></div>
      </div>
    );
  }
};

const mapStateToProps = state => ({ htmlClassManager: state.htmlClassManager });
const mapDispatchToProps = dispatch => (
  bindActionCreators(Object.assign({}, { htmlClassesRemove }), dispatch)
);

const ConnectedSideMenu = connect(mapStateToProps, mapDispatchToProps)(SideMenu);

// Wrap in LockScroll component.
const LockScollWrap = ({ ...props }) => (
  <LockScroll isLocked={props.isOpen} >
    <ConnectedSideMenu {...props} />
  </LockScroll>
);

export { LockScollWrap as SideMenu };
