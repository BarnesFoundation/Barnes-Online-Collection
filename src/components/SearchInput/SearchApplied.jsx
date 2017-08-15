import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class SearchApplied extends Component {
  render() {
    return (
      <div>
        <p>Results for {this.props.search}</p>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    search: state.search
  }
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Object.assign({}), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchApplied);

