import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as QueryActions from '../../actions/query';
import * as ObjectActions from '../../actions/objects';

class Nav extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
    );
  }
}

function mapStateToProps(state) {
  return {
    query: state.query
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({},ObjectActions, QueryActions),
    dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav);
