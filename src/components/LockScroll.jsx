import React, { Component } from "react";

// Keep track of global locked state.
let globalIsLocked = false;

/** HOC to lock scroll in place. */
export class LockScroll extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scrollY: 0,
      willUnlock: null,
      isGlobalLock: false,
    };
  }

  /**
   * If locked prop changes, modify scroll lock status.
   */
  componentDidUpdate(prevProps) {
    const { isLocked } = this.props;
    const { isGlobalLock } = this.state;

    // If our props do not match.
    if (prevProps.isLocked !== isLocked) {
      if (isLocked) {
        // If this is not already locked.
        if (!globalIsLocked) {
          globalIsLocked = true; // Update global state variable;

          this.setUpScrollLock(isLocked);
        } else {
          this.setState({ isLocked: false });
        }
      } else {
        if (isGlobalLock) {
          // Unlock after animation has performed.
          globalIsLocked = false; // Update global state variable.

          this.setState({
            willUnlock: setTimeout(() => this.setUpScrollLock(isLocked), 300),
          });
        } else {
          this.setState({ isLocked: true });
        }
      }
    }
  }

  /** cWU to cleanup STO on unmount. */
  componentWillUnmount() {
    const { willUnlock } = this.state;

    if (willUnlock) clearTimeout(willUnlock);
  }

  /**
   * On update, access a17 and root to lock scrollbar in place
   * TODO => Rewrite this in a more declarative style, not accessing DOM elements imperatively.
   * @param {boolean} isLock - if scroll should be locked.
   * */
  setUpScrollLock(isLock) {
    const windowScrollY = window.pageYOffset;

    if (isLock) {
      // On menu appearing, set up where the scroll was.
      this.setState({
        scrollY: window.pageYOffset,
        isGlobalLock: true,
      });
    }

    document.getElementById("root").style.position = isLock ? "absolute" : null;
    document.getElementById("root").style.width = isLock ? "100%" : null;
    document.getElementById("root").style.top = isLock
      ? `-${windowScrollY}px`
      : null;
    document.getElementById("a17").style.height = isLock ? "100vh" : null;
    document.getElementById("a17").style.overflow = isLock ? "hidden" : null;

    if (!isLock) {
      // On menu disappearing, scroll down to where saved state is.
      window.scrollTo(0, this.state.scrollY);

      this.setState({ isGlobalLock: false });
    }
  }

  render() {
    const { children } = this.props;

    // Map over children and add scroll lock reset function.
    return <div>{children}</div>;
  }
}
