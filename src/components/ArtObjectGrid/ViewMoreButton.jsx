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
    const noSearch = this.props.search.length === 0;
    const noFilters = !this.props.filters.ordered || this.props.filters.ordered.length === 0;

    if (noSearch && noFilters) {
      debugger;
      // Get next 25 objects.
      // Append to existing group of objects.
    } else if (noSearch) {
      debugger;
    } else if (noFilters) {
      debugger;
    }
  }

  render() {
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
  }
}

const mapStateToProps = state => {
  return {
    filters: state.filters,
    search: state.search,
    objects: state.objects
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign({},
    ObjectsActions
  ));
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewMoreButton);
