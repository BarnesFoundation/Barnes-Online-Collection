import React, { Component } from "react";

import FilterTag from "./FilterTag";

class FilterTagSetGeneric extends Component {
  filterTags() {
    const filters = this.props.filterTags;
    if (!filters) {
      return null;
    } else {
      return filters.map((filter, index) => (
        <FilterTag key={index} index={index} filter={filter} />
      ));
    }
  }

  render() {
    return <div className="filter-tag-set">{this.filterTags()}</div>;
  }
}

export default FilterTagSetGeneric;
