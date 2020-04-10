import React, { Component } from 'react';
import Draggable from 'react-draggable';
import Icon from '../../Icon';
import './quickScroll.css';

export class QuickScroll extends Component {
    constructor(props) {
        super(props);

        this.ref = null;

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

        // Add event handler to handle scroll.
        scrollRef.addEventListener('scroll', () => {
            this.setState({
                // 250 = px of apply section and footer.
                scrollHeight: Math.max((scrollRef.scrollTop - (scrollRef.offsetTop + 250)), 0)/(scrollRef.scrollHeight - scrollRef.clientHeight),
                isScroll: true,
            });
        });
    }

    /**
     * Set up ref for listening to if a drag event is happening.
     */
    setRef = (ref) => {
        if (!this.ref) {
            this.ref = ref;
            this.forceUpdate();
        }
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

        this.setState({
            scrollHeight: y,
            isScroll: false,
        });
    }


    render() {
        const { scrollRef } = this.props;
        const { scrollHeight, isScroll } = this.state;

        // If this is a scroll event as opposed to a manipulation of the quickscroll,
        // perform additional calculation to find height of controlled draggable quickscroll element.
        const translateCalcHeight = isScroll
            ? Math.floor(scrollHeight * (scrollRef.offsetHeight - 60))
            : scrollHeight;

        return (
            <div className='quick-scroll-wrapper'>
                <Draggable
                    axis='y'
                    bounds='parent'
                    onDrag={this.setHeight}
                    position={{ x: 0, y: translateCalcHeight }}
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