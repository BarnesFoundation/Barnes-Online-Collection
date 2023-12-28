import React, { Component } from "react";

/** Component to keep track of clicking outside of menu. */
export class ClickTracker extends Component {
  constructor(props) {
    super(props);

    this.ref = null; // Ref for wrapper div.

    // This will essentially be () => reset() for Dropdowns on cDM.
    this.state = {
      resetFunction: this.props.resetFunction || null,
    };
  }

  /** Listen to clicks outside of div and cleanup on unmount. */
  componentDidMount() {
    document.addEventListener("mousedown", this.handleClick);
    document.addEventListener("keydown", this.handleEsc);
  }

  /** Cleanup event listeners. */
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClick);
    document.removeEventListener("keydown", this.handleEsc);
  }

  /**
   * Invoke reset on click outside of ref.
   * @param {MouseEvent} - mouse press.
   */
  handleClick = ({ target }) => {
    const { forwardedRef } = this.props;
    const { resetFunction } = this.state;

    // Prefer forwarded ref over this ref.
    const refToUse = forwardedRef || this.ref;

    // If the ref is set up, the event is outside of the ref, and resetFunction was set in cDM.
    if (refToUse && !refToUse.contains(target) && resetFunction) {
      resetFunction(); // Reset on click out
    }
  };

  /**
   * Invoke reset on click outside of escape press.
   * @param {KeyboardEvent} - key press.
   */
  handleEsc = ({ key }) => {
    const { resetFunction } = this.state;

    // Invoke reset function if this key is escape and reset function is set.
    if (key === "Escape" && resetFunction) {
      resetFunction();
    }
  };

  // Set reset function.
  setResetFunction = (resetFunction) => this.setState({ resetFunction });

  render() {
    const { children, resetFunction } = this.props;

    return (
      <div
        ref={(ref) => {
          if (!this.ref) {
            this.ref = ref;
          }
        }}
      >
        {resetFunction
          ? children
          : React.Children.map(children, (child) =>
              React.cloneElement(child, {
                ...this.props,
                setResetFunction: this.setResetFunction,
              })
            )}
      </div>
    );
  }
}
