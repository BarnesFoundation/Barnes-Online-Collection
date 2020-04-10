import React, { Component } from 'react';
import Draggable from 'react-draggable';
import Icon from '../../Icon';
import './quickScroll.css';

export class QuickScroll extends Component {
    constructor(props) {
        super(props);

        this.state = {
            scrollHeight: 0,
            isScroll: true,
        }
    }

    /**
     * Add event listener for scroll detection.
     */
    componentDidMount() {
        const { scrollRef } = this.props;

        scrollRef.addEventListener('scroll', this.scroll);
    }

    /**
     * Cleanup event listeners.
     */
    componentWillUnmount() {
        const { scrollRef } = this.props;

        scrollRef.removeEventListener('scroll', this.scroll);
    }


    /**
     * Scroll event handler.
     */
    scroll = () => {
        const { scrollRef } = this.props;

        // 250 = px of apply section and footer.
        this.setState({
            scrollHeight: Math.max((scrollRef.scrollTop - (scrollRef.offsetTop + 250)), 0)/(scrollRef.scrollHeight - scrollRef.clientHeight) * (scrollRef.offsetHeight - 60),
        });
    }

    /**
     * Handler to set height via manipulating the draggable element.
     * @param {DraggableEventHandler} e - draggable event.
     * @param {DraggableData} - coordinate and node data from draggable.
     */
    setHeight = (_e, { y }) => {
        const { scrollRef, heightRef: { offsetHeight }} = this.props;

        // To calculate scroll value, find percentage of scroll in scrollRef against 
        // the total height of the <ul>
        const scrollToY = offsetHeight * (y/(scrollRef.offsetHeight - 60));
        scrollRef.scrollTo(0, scrollToY);

        this.setState({ scrollHeight: y });
    }


    render() {
        const { scrollHeight } = this.state;

        return (
            <div className='quick-scroll-wrapper'>
                <Draggable
                    axis='y'
                    bounds='parent'
                    onDrag={this.setHeight}
                    position={{ x: 0, y: scrollHeight }}
                >
                    <div
                        className='quick-scroll'
                        ref={this.setRef}
                    >
                        <Icon
                            svgId='-icon_arrow_down'
                            classes='quick-scroll__icon quick-scroll__icon--up'
                        />
                        
                        <Icon
                            svgId='-icon_arrow_down'
                            classes='quick-scroll__icon quick-scroll__icon--down'
                        />
                    </div>
                    </Draggable>
            </div>
        )
    }
}