import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import LandingPage from './layouts/LandingPage/LandingPage';
import ArtObjectPage from './layouts/ArtObjectPage/ArtObjectPage';
import ArtObjectPageModal from './components/ArtObjectPageComponents/ArtObjectPageModal';
import { withRouter } from 'react-router'

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
class ModalSwitch extends Component {
  previousLocation = this.props.location

  componentWillUpdate(nextProps) {
    const { location } = this.props
    // set previousLocation if props.location is not modal
    if (
      nextProps.history.action !== 'POP' &&
      (!location.state || !location.state.isModal)
    ) {
      this.previousLocation = this.props.location
    }
  }

  render() {
    const { location } = this.props
    const locationState = location.state || {};

    let isModal = !!(
      locationState.isModal &&
      this.previousLocation !== location // not initial render
    )

    // do this in the next commit...
    // let modalPreviousLocation = locationState.previousLocation ? {
    //   pathname: locationState.previousLocation,
    // } : this.previousLocation;

    let modalPreviousLocation = this.previousLocation;

    // todo: temp fix for slightly-broken react-docs implmentation.
    // If you click through urls, then reload the page, then go back, the previousLocation is no longer correct..
    // which breaks our app. So for now, since we only have a modal on the landing page, use this quick fix,
    // until we think through the better solution
    if (this.previousLocation && this.previousLocation.pathname !== '/') {
      isModal = false;
    }

    return (
      <div>
        <Switch location={isModal ? modalPreviousLocation : location}>
          <Route exact path='/' component={LandingPage}/>
          <Route exact path='/objects/:id' component={ArtObjectPage}/>
          <Route exact path="/objects/:id/:panel" component={ArtObjectPage} />
        </Switch>
        {isModal ?
          <div>
            <PropsRoute exact path='/objects/:id'
              component={ArtObjectPageModal}
              isModal={isModal}
              previousLocation={modalPreviousLocation.pathname || null}
            />
            <PropsRoute exact path='/objects/:id/:panel'
              component={ArtObjectPageModal}
              isModal={isModal}
              previousLocation={modalPreviousLocation.pathname || null}
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
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({},
  ), dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ModalSwitch));
