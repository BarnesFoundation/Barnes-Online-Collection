import React, { Component } from 'react';

/** HOC to lock scroll in place. */
export class LockScroll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: 0,
    };
  }
  
  /**
   * If locked prop changes, modify scroll lock status.
   */
  componentDidUpdate(prevProps) {
    if (prevProps.isLocked !== this.props.isLocked) {
      this.setUpScrollLock(this.props.isLocked);
    }
  }

  /**
   * On update, access a17 and root to lock scrollbar in place
   * TODO => Rewrite this in a more declarative style, not accessing DOM elements imperatively.
   * @param {boolean} isLock - if scroll should be locked.
   * */
  setUpScrollLock(isLock) {
    const windowScrollY = window.pageYOffset;

    if (isLock) { // On menu appearing, set up where the scroll was.
      this.setState({ scrollY: window.pageYOffset });
    }

    document.getElementById('root').style.position = isLock ? 'absolute' : null;
    document.getElementById('root').style.width = isLock ? '100%' : null
    document.getElementById('root').style.top = isLock ? `-${windowScrollY}px` : null;
    document.getElementById('a17').style.height = isLock ? '100vh' : null;
    document.getElementById('a17').style.overflow = isLock ? 'hidden' : null;

    if (!isLock) { // On menu disappearing, scroll down to where saved state is.
      window.scrollTo(0, this.state.scrollY);
    }
  }

  render() {
    const { children } = this.props;

    // Map over children and add scroll lock reset function.
    return (
        <div>
            {React.Children.map(children, (child) => (
                React.cloneElement(child, {
                    resetLock: () => this.setUpScrollLock(false), // add resetFunction for components that do not unmount.
                })
            ))}
        </div>
    );
  }
}
