import React, { Component } from "react";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { CLASSNAME_MOBILE_PANEL_OPEN, BREAKPOINTS } from "../../constants";
import CollectionFiltersMenu from "./CollectionFiltersMenu";
import CollectionFiltersSet from "./CollectionFiltersSet";
import SearchInput from "../SearchInput/SearchInput";
import * as FiltersActions from "../../actions/filters";
import * as SearchActions from "../../actions/search";
import * as FilterSetsActions from "../../actions/filterSets";
import * as MobileFiltersActions from "../../actions/mobileFilters";
import * as MobileSearchActions from "../../actions/mobileSearch";
import * as ObjectsActions from "../../actions/objects";
import * as HtmlClassManagerActions from "../../actions/htmlClassManager";
import MediaQuery from "react-responsive";
// import MobileFiltersMenu from './MobileFiltersMenu';
// import MobileSearchMenu from './MobileSearchMenu';
// import MobileFiltersOpener from './MobileFiltersOpener';
// import MobilePanelCloser from './MobilePanelCloser';
import "./collectionFilters.css";
import { ClickTracker } from "../SearchInput/Dropdowns/ClickTracker";

class CollectionFilters extends Component {
  constructor(props) {
    super(props);

    this.ref = null; // This ref is for CollectionFiltersMenu scrollIntoView method.
  }

  hasBeenReset(props) {
    const hasNothingSet =
      !props.search.length &&
      !props.filters.ordered.length &&
      !Object.values(props.filters.advancedFilters).reduce(
        (acc, advancedFilter) => acc + Object.keys(advancedFilter).length,
        0
      );

    const searchHasChanged = props.search !== this.props.search;
    const filtersHaveChanged =
      props.filters.ordered !== this.props.filters.ordered ||
      JSON.stringify(props.filters.advancedFilters) !==
        JSON.stringify(this.props.filters.advancedFilters);

    return hasNothingSet && (searchHasChanged || filtersHaveChanged);
  }

  /**
   * Keydown listener to close collection filter if escape is pressed while focus lies within menu.
   */
  keyListener = (e) => {
    const {
      selectFilterSet,
      filterSets: { isArtistMenuToggled },
    } = this.props;

    if (
      e.key === "Escape" &&
      this.ref &&
      document.activeElement &&
      this.ref.contains(document.activeElement) &&
      !isArtistMenuToggled
    ) {
      selectFilterSet(null);
    }
  };

  // Set up event listener for escape key.
  componentDidMount() {
    document.addEventListener("keydown", this.keyListener);
  }

  // On unmount, remove event listener for escape key.
  componentWillUnmount() {
    document.removeEventListener("keydown", this.keyListener);
  }

  componentWillReceiveProps(nextProps) {
    const mobileFiltersWasOpen = this.props.mobileFilters.visible;
    const mobileFiltersWillBeOpen = nextProps.mobileFilters.visible;
    const mobileSearchWillBeOpen = nextProps.mobileSearch.visible;

    // this will keep these html class states correct.
    if (mobileFiltersWillBeOpen || mobileSearchWillBeOpen) {
      this.props.htmlClassesAdd(CLASSNAME_MOBILE_PANEL_OPEN);
    } else {
      this.props.htmlClassesRemove(CLASSNAME_MOBILE_PANEL_OPEN);
    }

    // if a search was just submitted
    if (nextProps.search.length && nextProps.search !== this.props.search) {
      this.props.searchObjects(nextProps.search);
      this.props.clearAllFilters();
      this.props.closeFilterSet();
      this.props.closeMobileFilters();
      this.props.closeMobileSearch();
      return;
    }

    // if it's been reset
    if (this.hasBeenReset(nextProps)) {
      this.props.getAllObjects();
      this.props.closeMobileFilters();
      this.props.closeMobileSearch();
      return;
    }

    if (mobileFiltersWasOpen) {
      // if we're editing mobile filters
      if (mobileFiltersWillBeOpen) {
        // if we've changed something about the filters
        if (this.props.filters.ordered !== nextProps.filters.ordered) {
          // queue the change and move on
          this.props.queueMobileFilters(nextProps.filters.ordered);
        }

        return;
      }

      // if we are closing the mobile filters
      if (!mobileFiltersWillBeOpen) {
        // Note: We're showing filters on the main page now,
        // and we're not setup to store both two states in order to revert to
        // the last state... So for now, just apply the changes every time.
        // if (!this.mobileFiltersApplied(nextProps)) {
        // // if we've closed the filter panel without hitting the apply button, do nothing
        //   return;
        // }

        // if no changes are pending, do nothing
        if (!this.props.mobileFilters.filtersPending) {
          return;

          // if there are changes pending
        } else {
          // if they're added filters, find the filtered objects
          if (nextProps.filters.ordered.length) {
            this.props.findFilteredObjects(nextProps.filters);
            this.props.clearSearchTerm();

            // if they're cleared filters, get everything
          } else {
            this.props.getAllObjects();
          }
        }
      }
      // end
      return;
    }

    // if we're just opening the mobile panel for the first time
    if (mobileFiltersWillBeOpen) {
      return;
    }

    // otherwise, we're not in mobile search land, handle the new filter
    if (
      nextProps.filters.ordered !== this.props.filters.ordered || // High-level filters
      JSON.stringify(nextProps.filters.advancedFilters) !==
        JSON.stringify(this.props.filters.advancedFilters) // Advanced Filters
    ) {
      this.props.findFilteredObjects(nextProps.filters, 0);
      this.props.clearSearchTerm();

      return;
    }
  }

  render() {
    const {
      filterSets: { visibleFilterSet },
      selectFilterSet,
    } = this.props;

    return (
      <div
        className="container collection-filters-wrap__container"
        ref={(ref) => {
          if (!this.ref) {
            this.ref = ref;
            this.forceUpdate();
          }
        }}
      >
        <MediaQuery maxWidth={BREAKPOINTS.tablet_max}>
          <CollectionFiltersMenu parentContainer={this.ref} />
        </MediaQuery>
        <MediaQuery minWidth={BREAKPOINTS.tablet_max + 1}>
          <CollectionFiltersMenu parentContainer={this.ref} hasScroll />
        </MediaQuery>
        <MediaQuery maxDeviceWidth={BREAKPOINTS.tablet_max}>
          <ClickTracker
            forwardedRef={this.ref}
            resetFunction={() => selectFilterSet(null)}
          >
            <div className="m-block m-block--flush applied-filters">
              {visibleFilterSet === "search" ? (
                <SearchInput isCollectionAdvancedSearch />
              ) : (
                <CollectionFiltersSet />
              )}
            </div>
          </ClickTracker>
        </MediaQuery>
        <MediaQuery minDeviceWidth={BREAKPOINTS.tablet_max + 1}>
          <div className="m-block m-block--flush applied-filters">
            {visibleFilterSet === "search" ? (
              <SearchInput isCollectionAdvancedSearch />
            ) : (
              <CollectionFiltersSet />
            )}
          </div>
        </MediaQuery>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    filterSets: state.filterSets,
    mobileFilters: state.mobileFilters,
    mobileSearch: state.mobileSearch,
    filters: state.filters,
    search: state.search,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    Object.assign(
      {},
      FiltersActions,
      SearchActions,
      FilterSetsActions,
      MobileFiltersActions,
      MobileSearchActions,
      ObjectsActions,
      HtmlClassManagerActions
    ),
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CollectionFilters);
