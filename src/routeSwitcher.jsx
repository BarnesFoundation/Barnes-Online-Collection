import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import LandingPage from './layouts/LandingPage/LandingPage';
import ArtObjectPage from './layouts/ArtObjectPage/ArtObjectPage';
import ArtObjectPageModal from './components/ArtObjectPageComponents/ArtObjectPageModal';
import * as ModalActions from './actions/modal';
// todo:
import * as ObjectsActions from './actions/objects';
import * as FilterSetsActions from './actions/filterSets';
import * as SearchActions from './actions/search';
import * as RouteSearchUrlHelper from './routeSearchUrlHelper';

const queryString = require('query-string');

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return (
    React.createElement(component, finalProps)
  );
}

const PropsRoute = ({ component, ...rest }) => {
  return (
    <Route {...rest} render={routeProps => {
      return renderMergedProps(component, routeProps, rest);
    }}/>
  );
}

// Note: with tips from  https://reacttraining.com/react-router/web/example/modal-gallery
class RouteSwitcher extends Component {
  constructor(props) {
    super(props)

    this.modalPreviousLocation = this.props.location
  }


  componentWillUpdate(nextProps) {
    const { location } = this.props
    const nextLocation = nextProps.location
    const locationState = nextLocation.state || {}
    const previousLocationState = location.state || {}
    const currModalParentState = this.props.modalParentState

    let isModal = locationState.isModal

    // if props.location is not modal, update modalPreviousLocation
    if (nextProps.history.action !== 'POP' && !previousLocationState.isModal) {
      this.modalPreviousLocation = this.props.location
    }

    // parse the modalPreviousLocation -- either from the state passed in to the nextProps
    // or from the router component's 'this.modalPreviousLocation'
    let modalPreviousLocation = locationState.modalPreviousLocation ? {
      pathname: locationState.modalPreviousLocation,
    } : this.modalPreviousLocation;

    // it it's a modal, and it the pathname is different, we need to update the parentState modalPreviousLocation
    // this is used by the modal component to change the url via pushstate when the modal closes.
    if (isModal && modalPreviousLocation.pathname !== currModalParentState.pathname) {
      this.props.modalSetParentState({
        pathname: modalPreviousLocation.pathname,
      });
    }

    // set these to be used by the render function
    this.primaryRouteLocation = isModal ? modalPreviousLocation : nextLocation
    this.modalRouteComponents = isModal ?
      (<div>
        <PropsRoute exact path='/objects/:id/:title'
          component={ArtObjectPageModal}
          isModal={true}
          modalPreviousLocation={modalPreviousLocation.pathname || null}
        />
        <PropsRoute exact path='/objects/:id/:title/:panel'
          component={ArtObjectPageModal}
          isModal={true}
          modalPreviousLocation={modalPreviousLocation.pathname || null}
        />
      </div>)
      : null
  }

  componentDidUpdate(nextProps) {
    const parsedQuery = queryString.parse(this.props.location.search);
    const queryType = parsedQuery.qtype;
    const queryVal = parsedQuery.qval;
    const searchTerm = this.props.search;
    const filters = this.props.filters;
    const filterSet = this.props.filterSets.visibleFilterSet;

    const hasSearch = searchTerm.length > 0;
    const hasFilters = filters.ordered && filters.ordered.length > 0;

    debugger;
    if (hasSearch) {
      if (searchTerm !== queryVal) {
        this.props.history.push(`?qtype=keyword&qval=${searchTerm}`);
      }
    } else if (hasFilters) {
      let filtersVal = RouteSearchUrlHelper.parseFilters(filters.ordered);

      if (filtersVal !== queryVal) {
        this.props.history.push(`?qtype=filter&qval=${filtersVal}`);
      }
    } else if (queryType) {
      // there's no searchTerm or Filters, so the query url needs to be cleared.
      this.props.history.push(``);
    }

    // if (queryVal && queryVal !== searchTerm) {
    //   this.props.addSearchTerm(queryVal);
    //   this.props.selectFilterSet('search');
    // }
  }

  render() {
    // the first render will default to the live url
    // the modal logic above will sometimes set this.primaryRouteLocation to be something other than props.location
    const primaryRouteLocation = this.primaryRouteLocation || this.props.location

    return (
      <div>
        <Switch location={primaryRouteLocation}>
          <Route exact path='/' component={LandingPage}/>
          <Route exact path='/objects/' component={LandingPage}/>
          <Route exact path='/objects/:id/:title' component={ArtObjectPage}/>
          <Route exact path='/objects/:id/:title/:panel' component={ArtObjectPage} />
        </Switch>
        {this.modalRouteComponents}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    modalParentState: state.modal.modalParentState,
    filterSets: state.filterSets,
    // ? todo
    // mobileFilters: state.mobileFilters,
    // mobileSearch: state.mobileSearch,
    filters: state.filters,
    search: state.search,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({},
    ModalActions,
    ObjectsActions,
    FilterSetsActions,
    SearchActions,
  ), dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RouteSwitcher));
