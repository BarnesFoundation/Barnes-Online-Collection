import React, { Component } from 'react';

/** Component to keep track of clicking outside of menu. */
export class ClickTracker extends Component {
    constructor(props) {
        super(props);

        this.ref = null; // Ref for wrapper div.

        // This will essentially be () => reset() for Dropdowns on cDM.
        this.state = { resetFunction: null };
    }

    // Listen to clicks outside of div and cleanup on unmount.
    componentDidMount() { document.addEventListener('mousedown', this.handleClick) }
    componentWillUnmount() { document.removeEventListener('mousedown', this.handleClick) }

    // On click outside of dropdown.
    handleClick = (event) => {
        const { resetFunction } = this.state;

        // If the ref is set up, the event is outside of the ref, and resetFunction was set in cDM.
        if (this.ref && !this.ref.contains(event.target) && resetFunction) {
            resetFunction(); // Reset on click out
        }
    };

    // Set reset function.
    setResetFunction = resetFunction => this.setState({ resetFunction });
    
    render() {
        const { children } = this.props;

        return (
            <div ref={ref => this.ref = ref}>
                {React.Children.map(children, (child) => (
                    React.cloneElement(child, { ...this.props, setResetFunction: this.setResetFunction })
                ))}
            </div>
        );
    }
}
