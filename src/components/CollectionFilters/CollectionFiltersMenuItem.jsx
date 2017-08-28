import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as FilterSetsActions from '../../actions/filterSets';

class CollectionFiltersMenuItem extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    this.props.selectFilterSet(this.props.slug);
  }

  getClassNames() {
    const slug = this.props.slug;
    let classNames = 'btn-collection-filter font-zeta color-light';

    if (slug === 'search') {
      classNames += ' btn-collection-filter--search';
    } else if (slug === 'shuffle') {
      classNames += ' btn-collection-filter--shuffle';
    }

    if (slug === this.props.filterSets.visibleFilterSet) {
      classNames += ' is-selected';
    }

    return classNames;
  }

  render() {
    const slug = this.props.slug;
    return (
      <button
        className={this.getClassNames()}
        onClick={this.handleClick}>
        <img className="collection-filter-icon" alt="X"/>
        {this.props.title}
      </button>
    );
  }
}

const mapStateToProps = state => {
  return {
    filterSets: state.filterSets
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign(
    {},
    FilterSetsActions
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionFiltersMenuItem);
