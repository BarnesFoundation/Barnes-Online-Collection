import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as QueryActions from '../../actions/query';
import * as ObjectActions from '../../actions/objects';

import SiteHeader from '../../components/SiteHeader/SiteHeader';
import HeaderText from '../../components/HeaderText/HeaderText';
import CollectionFiltersPanel from '../../components/CollectionFilters/CollectionFiltersPanel';

class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <SiteHeader />
        <HeaderText text="Albert Barnes taught people to look at works of art primarily in terms of their visual relationships."/>
        <CollectionFiltersPanel />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    query: state.query
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({},ObjectActions, QueryActions),
    dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
