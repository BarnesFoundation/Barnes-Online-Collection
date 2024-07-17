import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { LockScroll } from "../LockScroll";
import { htmlClassesRemove } from "../../actions/htmlClassManager";
import { MAIN_WEBSITE_DOMAIN } from "../../constants";
import "./SideMenu.css";

const IMPORTANT_LINKS = [
  { href: MAIN_WEBSITE_DOMAIN + "/whats-on", text: "What’s On" },
  { href: MAIN_WEBSITE_DOMAIN + "/plan-your-visit", text: "Plan Your Visit" },
  { href: "/", text: "Our Collection", isCurrent: true },
  { href: MAIN_WEBSITE_DOMAIN + "/classes", text: "Take a Class" },
];
const REGULAR_LINKS = [
  { href: MAIN_WEBSITE_DOMAIN + "/about", text: "About" },
  { href: MAIN_WEBSITE_DOMAIN + "/support", text: "Support" },
  { href: MAIN_WEBSITE_DOMAIN + "/school-programs", text: "School Programs" },
  {
    href: MAIN_WEBSITE_DOMAIN + "/about/careers-and-volunteering",
    text: "Careers",
  },
  { href: MAIN_WEBSITE_DOMAIN + "/research", text: "Research" },
  { href: MAIN_WEBSITE_DOMAIN + "/press", text: "Press" },
  { href: "https://shop.barnesfoundation.org/", text: "Shop" },
  { href: MAIN_WEBSITE_DOMAIN + "/host-an-event", text: "Host an Event" },
  { href: MAIN_WEBSITE_DOMAIN + "/plan-your-visit/group-visits", text: "Group Visits" },
  { href: MAIN_WEBSITE_DOMAIN + "/whats-on/arboretum", text: "Arboretum" },
];

/**
 * Default side menu for navigation.
 * If there is children for @see SideMenu.jsx, this is not rendered.
 */
const DefaultSideMenu = ({ setEndRef, isOpen }) => (
  <nav className="g-nav__links" aria-labelledby="g-nav__title">
    <div className="g-nav__important-links">
      {IMPORTANT_LINKS.map(({ href, text, isCurrent }) => (
        <a
          className="g-nav__link g-nav__link--important"
          href={href}
          aria-current={isCurrent}
          key={text}
          tabIndex={isOpen ? 0 : -1}
        >
          <span>{text}</span>
        </a>
      ))}
    </div>
    {REGULAR_LINKS.map(({ href, text }, i) => {
      let additionalProps = {};
      if (i === REGULAR_LINKS.length - 1 && setEndRef) {
        additionalProps = { ...additionalProps, ref: setEndRef };
      }

      return (
        <a
          className="g-nav__link"
          href={href}
          key={text}
          tabIndex={isOpen ? 0 : -1}
          {...additionalProps}
        >
          <span>{text}</span>
        </a>
      );
    })}
  </nav>
);

// Representations of the different states possible for the overlay.
// The additional state of TRANSITION in necessary to keep the width of the overlay for the opacity animation to complete.
const OVERLAY_STATES = {
  ACTIVE: "ACTIVE",
  TRANSITION: "TRANSITION",
  INACTIVE: "INACTIVE",
};

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

    this.startRef = null;
    this.endRef = null;
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
   * Key listener function to keep track of tab and esc.
   * Listen for tabs to keep tabs within side menu.
   */
  keyListener = (e) => {
    const { isOpen, closeMenu } = this.props;

    // Keep tab contained on tab.
    if (
      e.key === "Tab" &&
      isOpen &&
      this.startRef &&
      this.endRef &&
      document.activeElement === this.endRef
    ) {
      this.startRef.focus();
    }

    // Close menu on escape.
    if (e.key === "Escape" && isOpen) {
      closeMenu();
    }
  };

  /**
   * Add event listener for tab and esc key.
   */
  componentDidMount() {
    document.addEventListener("keydown", this.keyListener);
  }

  /**
   * On unmount: if setTimeout exists, clear it.
   * Remove event listener for tab and esc key.
   */
  componentWillUnmount() {
    document.removeEventListener("keydown", this.keyListener);

    if (this.sto) clearTimeout(this.sto);
  }

  render() {
    const { closeMenu, isOpen, children, setRef } = this.props;
    const { isOverlayActive } = this.state;

    const handleNavCloseBtnClick = (e) => {
      e.preventDefault();
      closeMenu();
    };

    let sideMenuClassNames = "side-menu";
    if (isOpen) sideMenuClassNames = `${sideMenuClassNames} side-menu--active`;

    let gNavClassNames = "g-nav";
    if (children) {
      gNavClassNames = `${gNavClassNames} g-nav--custom`;
    } else {
      gNavClassNames = `${gNavClassNames} g-nav--main   `;
    }
    if (isOpen) gNavClassNames = `${gNavClassNames} g-nav--active`;

    let gNavOverlayClassNames = "g-nav-overlay";
    if (
      isOverlayActive === OVERLAY_STATES.ACTIVE ||
      isOverlayActive === OVERLAY_STATES.TRANSITION
    )
      gNavOverlayClassNames = `${gNavOverlayClassNames} g-nav-overlay--transition`;
    if (isOverlayActive === OVERLAY_STATES.ACTIVE)
      gNavOverlayClassNames = `${gNavOverlayClassNames} g-nav-overlay--active`;

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
      <div
        className={sideMenuClassNames}
        aria-hidden={!isOpen}
        // style={{
        //   visibility: isOpen ? 'visible' : 'hidden'
        // }}
      >
        <div className={gNavClassNames} data-behavior="nav">
          <div className="g-nav__inner" {...additionalProps}>
            <button
              onClick={handleNavCloseBtnClick}
              className="g-nav__close btn btn--icon-only html4-hidden"
              type="button"
              aria-labelledby="nav-close-title"
              data-nav-hide
              tabIndex={isOpen ? 0 : -1}
              ref={(ref) => (this.startRef = ref)}
            >
              <svg className="icon--close" width={20} height={20}>
                <title id="nav-close-title">Close menu</title>
                <use xlinkHref="#icon--icon_close" />
              </svg>
            </button>
            <h2 className="visuallyhidden" id="g-nav__title">
              Main menu
            </h2>
            {children || (
              <DefaultSideMenu
                setEndRef={(ref) => (this.endRef = ref)}
                isOpen={isOpen}
              />
            )}
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
}

const mapStateToProps = (state) => ({
  htmlClassManager: state.htmlClassManager,
});
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(Object.assign({}, { htmlClassesRemove }), dispatch);

const ConnectedSideMenu = connect(
  mapStateToProps,
  mapDispatchToProps
)(SideMenu);

// Wrap in LockScroll component.
const LockScollWrap = ({ ...props }) => (
  <LockScroll isLocked={props.isOpen}>
    <ConnectedSideMenu {...props} />
  </LockScroll>
);

export { LockScollWrap as SideMenu };
