import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Icon from '../Icon';

import * as FilterSetsActions from '../../actions/filterSets';
import * as ObjectsActions from '../../actions/objects';

class CollectionFiltersMenuItem extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    if (this.props.slug === 'shuffle') {
      this.props.findShuffledObjects();
    } else {
      this.props.selectFilterSet(this.props.slug);
    }
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
    return (
      <button
        className={this.getClassNames()}
        onClick={this.handleClick}
        data-tip={this.props.tooltip}
        data-for="collectionFilterMenuItem"
      >
        <div className="button-inner">
          <Icon svgId={this.props.svgId} classes='collection-filter-icon' />
          <span>
            {this.props.title}
          </span>
        </div>
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
    FilterSetsActions,
    ObjectsActions
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionFiltersMenuItem);
