import React, { Component } from 'react';

import CollectionFiltersSetTypeCheckbox from './CollectionFiltersSetTypeCheckbox';
import CollectionFiltersSetTypeRadio from './CollectionFiltersSetTypeRadio';
import CollectionFiltersSetTypeSlider from './CollectionFiltersSetTypeSlider';
import CollectionFiltersApplied from './CollectionFiltersApplied';

class CollectionFiltersSet extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let filterSet = null;

    switch (this.props.title) {
      case 'colors':
        filterSet = <CollectionFiltersSetTypeCheckbox />;
        break;
      case 'lines':
        filterSet = <div>
          <CollectionFiltersSetTypeRadio />
          <CollectionFiltersSetTypeRadio/>
        </div>;
        break;
      case 'light':
      case 'space':
        filterSet = <CollectionFiltersSetTypeSlider />;
        break;
      default:
        filterSet = <CollectionFiltersApplied />;
        break;
    }

    return (
      <div>
        <p>{this.props.title} Filters</p>
        {filterSet}
      </div>
    );
  }
}

export default CollectionFiltersSet;
