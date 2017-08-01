import React, { Component } from 'react';

import CollectionFiltersMenuItem from './CollectionFiltersMenuItem';

class CollectionFiltersMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentFilter: null,
      filters: {
        colors: {
          title: "Colors",
          type: "checkbox"
        },
        lines: {
          title: "Lines",
          type: "radio"
        },
        light: {
          title: "Light",
          type: "slider"
        },
        space: {
          title: "Space",
          type: "slider"
        },
        shuffle: {
          title: "Shuffle",
          type: "shuffle"
        },
        search: {
          title: "Search",
          type: "search"
        }
      }
    };
  }

  render() {
    return (
      <div>
        {
          Object
          .keys(this.state.filters)
          .map(key =>
            <CollectionFiltersMenuItem
              key={key}
              title={this.state.filters[key].title}
              name={this.state.filters[key]}
              selectFilter={this.props.selectFilter}
            />
          )
        }
      </div>
    );
  }
}

export default CollectionFiltersMenu;
