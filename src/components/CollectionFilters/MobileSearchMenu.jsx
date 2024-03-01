import React, { Component } from "react";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import SearchInput from "../SearchInput/SearchInput";

class MobileFiltersMenu extends Component {
  render() {
    return (
      <div className="mobile-panel mobile-search-panel">
        <SearchInput />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    search: state.search,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Object.assign({}), dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileFiltersMenu);
