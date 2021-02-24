import React, { Component } from 'react';
import './stickyList.css'

// todo:
// 

export default class StickyList extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params !== nextProps.match.params) {
    }
  }

  render() {
    const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nunc vel risus commodo viverra maecenas accumsan lacus vel. Semper auctor neque vitae tempus quam. Accumsan tortor posuere ac ut consequat semper. Volutpat ac tincidunt vitae semper quis lectus nulla at volutpat. Tortor dignissim convallis aenean et tortor at. Integer enim neque volutpat ac tincidunt vitae semper quis lectus. Tempor id eu nisl nunc. Vel facilisis volutpat est velit egestas dui id ornare arcu. Libero volutpat sed cras ornare.'

    return (
        <div className="sticky-list">
            <div className="sticky-list__section__header">Room 1</div>
            <div className="sticky-list__section__content">{lorem}</div>
            <div className="sticky-list__section__header">Room 2</div>
            <div className="sticky-list__section__content">{lorem}</div>
            <div className="sticky-list__section__header">Room 3</div>
            <div className="sticky-list__section__content">{lorem}</div>
            <div className="sticky-list__section__header">Room 4</div>
            <div className="sticky-list__section__content">{lorem}</div>
            <div className="sticky-list__section__header">Room 5</div>
            <div className="sticky-list__section__content">{lorem}</div>
            <div className="sticky-list__section__header">Room 6</div>
            <div className="sticky-list__section__content">{lorem}</div>
            <div className="sticky-list__section__header">Room 7</div>
            <div className="sticky-list__section__content">{lorem}</div>
            <div className="sticky-list__section__header">Room 8</div>
            <div className="sticky-list__section__content">{lorem}</div>
        </div>
    );
  }
}
