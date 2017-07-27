import React, { Component } from 'react';

import CollectionFiltersMenu from './CollectionFiltersMenu';
import SearchInput from '../SearchInput/SearchInput';
import CollectionFiltersSet from './CollectionFiltersSet';

class CollectionFiltersPanel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <p>CollectionFiltersPanel</p>
        <CollectionFiltersMenu />
        <SearchInput />
        <CollectionFiltersSet />
      </div>
    );
  }
}

export default CollectionFiltersPanel;
