import React, { Component } from 'react';

import CollectionFiltersMenu from './CollectionFiltersMenu';
import SearchInput from '../SearchInput/SearchInput';
import CollectionFiltersSet from './CollectionFiltersSet';
import CollectionFiltersApplied from './CollectionFiltersApplied';

import './collectionFilters.css';

class CollectionFiltersPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedFilter: null,
    };

    this.selectFilter = this.selectFilter.bind(this);
  }

  selectFilter(filterName) {
    const slug = filterName.toLowerCase();
    this.setState({ selectedFilter: slug });
  }

  render() {

    var selectedFilter = this.state.selectedFilter, visibleFilter;

    switch(selectedFilter) {
      case 'search':
        visibleFilter = <SearchInput />;
        break;
      case 'colors':
      case 'lines':
      case 'light':
      case 'space':
        visibleFilter = <CollectionFiltersSet selectedFilter={selectedFilter} title={selectedFilter} />;
        break;
      case 'shuffle':
      default:
        visibleFilter = null;
        break;
    }

    return (
      <div>
        <CollectionFiltersMenu selectedFilter={selectedFilter} selectFilter={this.selectFilter} />
        {visibleFilter}
        <CollectionFiltersApplied />
      </div>
    );
  }
}

export default CollectionFiltersPanel;
