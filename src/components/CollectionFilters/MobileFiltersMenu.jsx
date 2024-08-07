import React, { Component } from "react";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as MobileFiltersActions from "../../actions/mobileFilters";
import * as FiltersActions from "../../actions/filters";
import MobilePanelShuffleButton from "./MobilePanelShuffleButton";
import CollectionFiltersApplied from "./CollectionFiltersApplied";
import ColorFilters from "./ColorFilters";
import LineFilters from "./LineFilters";
import LightFilters from "./LightFilters";
import SpaceFilters from "./SpaceFilters";

class MobileFiltersMenu extends Component {
  constructor(props) {
    super(props);

    this.applyMobileFilters = this.applyMobileFilters.bind(this);
  }

  applyMobileFilters() {
    this.props.applyMobileFilters(this.props.filters.ordered);
    this.props.closeMobileFilters();
  }

  render() {
    const filters = this.props.filters.ordered;
    const hasFilters = filters && filters.length > 0;

    return (
      <div className="mobile-panel mobile-filters-panel">
        <CollectionFiltersApplied />
        {!hasFilters && (
          <div className="mobile-filters-section">
            <MobilePanelShuffleButton />
          </div>
        )}
        <ColorFilters />
        <LineFilters />
        <LightFilters />
        <SpaceFilters />
        <div className="mobile-apply-button-placeholder"></div>
        <div className="mobile-apply-button-wrap">
          <button
            className="btn btn--primary mobile-apply-button"
            onClick={this.applyMobileFilters}
          >
            Apply
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    filterSets: state.filterSets,
    mobileFilters: state.mobileFilters,
    filters: state.filters,
    search: state.search,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    Object.assign({}, MobileFiltersActions, FiltersActions),
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileFiltersMenu);
