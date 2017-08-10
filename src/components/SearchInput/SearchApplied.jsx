import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ObjectsActions from '../../actions/objects';

class SearchApplied extends Component {

  componentDidMount() {
    if (this.props.search.length > 0) {
      this.props.searchObjects(this.props.search);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.search.length > 0 && nextProps.search !== this.props.search) {
      this.props.searchObjects(nextProps.search);
    }
  }

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
  return bindActionCreators(Object.assign({},
    ObjectsActions
  ),
  dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchApplied);

