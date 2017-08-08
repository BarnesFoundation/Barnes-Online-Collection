import React, { Component } from 'react';

import CollectionFiltersSetTypeCheckbox from './CollectionFiltersSetTypeCheckbox';
import CollectionFiltersSetTypeRadio from './CollectionFiltersSetTypeRadio';
import CollectionFiltersSetTypeSlider from './CollectionFiltersSetTypeSlider';

class CollectionFiltersSet extends Component {
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
        filterSet = null;
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
