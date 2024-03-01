import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Icon from "../Icon";
import { selectFilterSet } from "../../actions/filterSets";
import MediaQuery from "react-responsive";

const LARGE_MOBILE_BREAKPOINT = 767;

const CollectionFiltersMenuItem = ({
  selectFilterSet,
  slug,
  svgId,
  title,
  visibleFilterSet,
  hasAdvancedFiltersOrSearch,
  scrollMenuIntoView,
}) => {
  let filterClassNames = "btn-collection-filter font-zeta color-light";
  if (slug === "search") {
    filterClassNames = `${filterClassNames} btn-collection-filter--search`;

    // Check if there are any advanced filters, if so, add class for notification.
    if (hasAdvancedFiltersOrSearch)
      filterClassNames = `${filterClassNames} btn-collection-filter--applied`;
  }
  if (slug === "shuffle")
    filterClassNames = `${filterClassNames} btn-collection-filter--shuffle`;
  if (slug === visibleFilterSet)
    filterClassNames = `${filterClassNames} is-selected`;

  return (
    <button
      className={filterClassNames}
      onClick={() => {
        scrollMenuIntoView();

        if (slug !== visibleFilterSet) {
          selectFilterSet(slug);
        } else {
          selectFilterSet(null);
        }
      }}
      tabIndex={0}
    >
      <div className="button-inner">
        <div className="button-inner__content">
          <Icon svgId={svgId} classes="collection-filter-icon" />
          <MediaQuery maxWidth={LARGE_MOBILE_BREAKPOINT}>
            <span className="button-inner__text">
              {slug === "search" ? "Search" : title}
            </span>
          </MediaQuery>
          <MediaQuery minWidth={LARGE_MOBILE_BREAKPOINT + 1}>
            <span className="button-inner__text">{title}</span>
          </MediaQuery>
        </div>
      </div>
    </button>
  );
};

const mapStateToProps = (state) => ({
  visibleFilterSet: state.filterSets.visibleFilterSet,

  // Check if there are any advanced filters or search.
  hasAdvancedFiltersOrSearch:
    // Check advanced filters
    Object.values(state.filters.advancedFilters)
      .flatMap(Object.keys) // Get all keys from advancedFilter's children.
      .some((obj) => obj.length) || // Check if there are any keys.
    // Check search.
    state.filters.search,
});
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(Object.assign({}, { selectFilterSet }), dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CollectionFiltersMenuItem);
