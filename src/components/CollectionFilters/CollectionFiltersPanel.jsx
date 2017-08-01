import React, { Component } from 'react';

import CollectionFiltersMenu from './CollectionFiltersMenu';
import SearchInput from '../SearchInput/SearchInput';
import CollectionFiltersSet from './CollectionFiltersSet';

class CollectionFiltersPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedFilter: null,
    };

    this.selectFilter = this.selectFilter.bind(this);
  }

  selectFilter(filterName) {
    console.log("Selected filter", filterName);
    this.setState({selectedFilter: filterName.toLowerCase()});
  }

  render() {
    return (
      <div>
        <CollectionFiltersMenu
          selectedFilter={this.state.selectedFilter}
          selectFilter={this.selectFilter}
        />

        {this.state.selectedFilter === 'search' &&
          <SearchInput />
        }

        {this.state.selectedFilter === "shuffle" &&
          <p>Shuffle state of filter panel</p>
        }

        {this.state.selectedFilter && this.state.selectedFilter !== 'search' && this.state.selectedFilter !== "shuffle" &&
          <CollectionFiltersSet selectedFilter={this.state.selectedFilter} title={this.state.selectedFilter}/>
        }
      </div>
    );
  }
}

export default CollectionFiltersPanel;
