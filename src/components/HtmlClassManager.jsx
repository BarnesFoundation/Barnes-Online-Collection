import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
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
    updateHtmlClassList(nextProps.classNameList);
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
    classNameList: state.htmlClassManager
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign(
    {},
    HtmlClassManagerActions
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(HtmlClassManager);
