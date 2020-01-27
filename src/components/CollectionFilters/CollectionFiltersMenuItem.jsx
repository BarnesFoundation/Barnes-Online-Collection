import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import Icon from '../Icon';
import * as FilterSetsActions from '../../actions/filterSets';
import * as FiltersActions from '../../actions/filters';
import * as ObjectsActions from '../../actions/objects';
import { BREAKPOINTS } from '../../constants';

class CollectionFiltersMenuItem extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    this.props.selectFilterSet(this.props.slug);

    if (this.props.slug === 'shuffle') this.props.shuffleFilters();
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
          <MediaQuery minWidth={BREAKPOINTS.mobile_max}>
            <span>
              {this.props.title}
            </span>
          </MediaQuery>
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
    FiltersActions,
    ObjectsActions
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionFiltersMenuItem);
