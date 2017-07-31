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
        },
        lines: {
          title: "Lines",
        },
        light: {
          title: "Light",
        },
        space: {
          title: "Space",
        },
        shuffle: {
          title: "Shuffle",
        },
        search: {
          title: "Search",
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
