import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const CLASS_NAMES = {
  navActive: 'nav-active',
}

const updateHtmlClassList = list => {
  // the <html> element
  document.documentElement.classList = list.join(' ');
};

class HtmlClassManager extends Component {
  static propTypes = {
    classNameList: React.PropTypes.array,
  }
  static defaultProps = {
    classNameList: [],
  }

  componentDidMount() {
    updateHtmlClassList(this.props.classNameList);
  }

  componentWillUpdate(nextProps) {
    updateHtmlClassList(nextProps.classNameList);
  }

  componentWillUnmount() {
    updateHtmlClassList([]);
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
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(HtmlClassManager);
