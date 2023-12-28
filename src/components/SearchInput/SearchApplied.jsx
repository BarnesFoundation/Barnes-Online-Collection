import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import ClearAllButton from "./ClearAllButton";

const SearchApplied = ({ search }) => (
  <div className="search-results">
    <p>Results for "{search}"</p>
    <ClearAllButton />
  </div>
);

const mapStateToProps = (state) => {
  return {
    search: state.search,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Object.assign({}), dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchApplied);
