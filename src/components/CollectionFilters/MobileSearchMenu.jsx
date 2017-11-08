import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import SearchInput from '../SearchInput/SearchInput';
import SearchApplied from '../SearchInput/SearchApplied';

class MobileFiltersMenu extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let searchPanel;

    if (this.props.search.length > 0) {
      searchPanel = <SearchApplied />;
    } else {
      searchPanel = <SearchInput />;
    }

    return (
      <div className="mobile-panel mobile-search-panel">
        {searchPanel}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    search: state.search,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign({},
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MobileFiltersMenu);
