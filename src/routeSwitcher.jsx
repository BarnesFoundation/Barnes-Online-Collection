import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import TourPage from './components/TourPage/TourPage';
import LandingPage from './components/LandingPage/LandingPage';
import ArtObjectPage from './components/ArtObjectPage/ArtObjectPage';
import ArtObjectPageModal from './components/ArtObjectPageComponents/ArtObjectPageModal';
import * as ModalActions from './actions/modal';

const renderMergedProps = (component, ...rest) => (
  React.createElement(component, Object.assign({}, ...rest))
);

const PropsRoute = ({ component, ...rest }) => {
  return (
    <Route {...rest} render={routeProps => {
      return renderMergedProps(component, routeProps, rest);
    }}/>
  );
};

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
          <Route exact path='/tour' component={LandingPage}/>
		      <Route path='/tour/:id' component={TourPage} />
        </Switch>
        {this.modalRouteComponents}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    modalParentState: state.modal.modalParentState,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({},
    ModalActions,
  ), dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RouteSwitcher));
