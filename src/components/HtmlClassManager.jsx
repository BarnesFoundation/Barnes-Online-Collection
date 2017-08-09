import React, { Component } from 'react';

const classNames = {
  navActive: 'nav-active',
}

class HtmlClassManager extends Component {
  static propTypes = {
    navActive: React.PropTypes.bool,
  }
  static defaultProps = {
    navActive: false,
  }

  componentDidMount() {
    document.body.classList.toggle(classNames.navActive, this.props.navActive)
  }

  componentWillReceiveProps(nextProps) {
    document.body.classList.toggle(classNames.navActive, nextProps.navActive)
  }

  componentWillUnmount() {
    document.body.classList.remove(classNames.navActive)
  }

  render() {
    return <div className="component-html-class-manager" />
  }
}

export default HtmlClassManager;