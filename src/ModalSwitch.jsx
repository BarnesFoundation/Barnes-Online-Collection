import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
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
      (!location.state || !location.state.modal)
    ) {
      this.previousLocation = this.props.location
    }
  }

  render() {
    const { location } = this.props

    let isModal = !!(
      location.state &&
      location.state.modal &&
      this.previousLocation !== location // not initial render
    )

    // todo: temp fix for slightly-broken react-docs implmentation.
    // If you click through urls, then reload the page, then go back, the previousLocation is no longer correct..
    // which breaks our app. So for now, since we only have a modal on the landing page, use this quick fix,
    // until we think through the better solution
    if (this.previousLocation && this.previousLocation.pathname !== '/') {
      isModal = false;
    }

    return (
      <div>
        <Switch location={isModal ? this.previousLocation : location}>
          <Route exact path='/' component={LandingPage}/>
          <Route exact path='/objects/:id' component={ArtObjectPage}/>
          <Route exact path="/objects/:id/:panel" component={ArtObjectPage} />
        </Switch>
        {isModal ?
          <PropsRoute path='/objects/:id' component={ArtObjectPageModal} isModal={isModal} />
          : null
        }
      </div>
    )
  }
}

export default withRouter(ModalSwitch);
