import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import LandingPage from './layouts/LandingPage/LandingPage';
import ArtObjectPage from './layouts/ArtObjectPage/ArtObjectPage';
import ArtObjectPageModal from './components/ArtObjectPageComponents/ArtObjectPageModal';
import * as ModalActions from './actions/modal';

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
  modalPreviousLocation = this.props.location

  componentWillUpdate(nextProps) {
    const { location } = this.props
    // set modalPreviousLocation if props.location is not modal
    if (
      nextProps.history.action !== 'POP' &&
      (!location.state || !location.state.isModal)
    ) {
      this.modalPreviousLocation = this.props.location
    }
  }

  render() {
    const { location } = this.props
    const locationState = location.state || {};

    let isModal = !!(
      locationState.isModal &&
      this.modalPreviousLocation !== location // not initial render
    )

    let modalPreviousLocation = locationState.modalPreviousLocation ? {
      pathname: locationState.modalPreviousLocation,
    } : this.modalPreviousLocation;

    const currModalParentState = this.props.modalParentState

    if (isModal && modalPreviousLocation.pathname !== currModalParentState.pathname) {
      this.props.modalSetParentState({
        pathname: modalPreviousLocation.pathname,
      });
    }

    return (
      <div>
        <Switch location={isModal ? modalPreviousLocation : location}>
          <Route exact path='/' component={LandingPage}/>
          <Route exact path='/objects/:id' component={ArtObjectPage}/>
          <Route exact path='/objects/:id/:panel' component={ArtObjectPage} />
        </Switch>
        {isModal ?
          <div>
            <PropsRoute exact path='/objects/:id'
              component={ArtObjectPageModal}
              isModal={isModal}
              modalPreviousLocation={modalPreviousLocation.pathname || null}
            />
            <PropsRoute exact path='/objects/:id/:panel'
              component={ArtObjectPageModal}
              isModal={isModal}
              modalPreviousLocation={modalPreviousLocation.pathname || null}
            />
          </div>
          : null
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    modalIsOpen: state.modal.modalIsOpen,
    modalParentState: state.modal.modalParentState,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({},
    ModalActions,
  ), dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RouteSwitcher));
