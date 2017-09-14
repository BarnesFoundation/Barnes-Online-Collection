import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ObjectsActions from '../../actions/objects';

class ViewMoreButton extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const search = this.props.search;
    const filters = this.props.filters;

    const hasSearch = search.length > 0;
    const hasFilters = filters.ordered && filters.ordered.length > 0;

    let query = null;

    if (hasSearch) {
      query = search;
    } else if (hasFilters) {
      query = filters;
    }

    const fromIndex = this.props.hitsDisplayed.lastIndex || 25;
    console.log(fromIndex);
    this.props.getNextObjects(fromIndex, query);
  }

  shouldShowButton() {
    return this.props.hitsDisplayed.maxHits > this.props.hitsDisplayed.lastIndex;
  }

  render() {
    if (this.shouldShowButton()) {
      return (
        <div className="view-more-button m-block m-block--no-border m-block--flush-bottom">
          <button
            className="btn"
            onClick={this.handleClick}
          >
            View More
          </button>
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}

const mapStateToProps = state => {
  return {
    filters: state.filters,
    search: state.search,
    objects: state.objects,
    hitsDisplayed: state.hitsDisplayed
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign({},
    ObjectsActions
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewMoreButton);
