import React, { Component } from "react";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as SearchActions from "../../actions/search";
import * as FiltersActions from "../../actions/filters";
import * as ObjectsActions from "../../actions/objects";

class ClearAllButton extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.clearSearchTerm();
    this.props.getAllObjects();
    this.props.clearAllFilters();
  }

  render() {
    return (
      <div onClick={this.handleClick} className="btn btn-no-style clear-all">
        Clear all
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    Object.assign({}, SearchActions, FiltersActions, ObjectsActions),
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ClearAllButton);
