import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as QueriesActions from '../../actions/queries';
import * as ObjectsActions from '../../actions/objects';

class QueryTag extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    this.props.removeFromQueries(this.props.index);
  }

  render() {
    return (
      <button onClick={this.handleClick}>{this.props.value} X</button>
    );
  }
}

const mapStateToProps = state => {
  return {
    queries: state.queries
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign({},
    ObjectsActions,
    QueriesActions
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(QueryTag);
