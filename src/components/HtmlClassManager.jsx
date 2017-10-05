import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { CLASSNAME_MODAL_OPEN } from '../constants';
import * as HtmlClassManagerActions from '../actions/htmlClassManager';

const updateHtmlClassList = list => {
  // the <html> element
  document.documentElement.className = list.join(' ');
};

const getLiveClassList = () => {
  // the <html> element
  return document.documentElement.className.split(' ');
};

var origClasslist = null;

class HtmlClassManager extends Component {
  static propTypes = {
    classNameList: React.PropTypes.array,
  };

  static defaultProps = {
    classNameList: [],
  }

  componentDidMount() {
    origClasslist = getLiveClassList();
    this.props.htmlClassesReset(origClasslist);
  }

  componentWillUpdate(nextProps) {
    // update the classList to the latest
    updateHtmlClassList(nextProps.classNameList);

    // then also, check if we need to update the classList with the modal state
    const modalHasChanged = this.props.modalIsOpen !== nextProps.modalIsOpen;

    if (!modalHasChanged) {
      return;
    }

    if (nextProps.modalIsOpen) {
      this.props.htmlClassesAdd(CLASSNAME_MODAL_OPEN);
    } else {
      this.props.htmlClassesRemove(CLASSNAME_MODAL_OPEN);
    }
  }

  componentWillUnmount() {
    updateHtmlClassList(origClasslist);
  }

  render() {
    return <div className="component-html-class-manager" />
  }
}

const mapStateToProps = state => {
  return {
    classNameList: state.htmlClassManager,
    modalIsOpen: state.ui.modalIsOpen,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign(
    {},
    HtmlClassManagerActions
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(HtmlClassManager);
