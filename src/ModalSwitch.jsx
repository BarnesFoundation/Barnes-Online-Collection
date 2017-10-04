import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import LandingPage from './layouts/LandingPage/LandingPage';
import ArtObjectPage from './layouts/ArtObjectPage/ArtObjectPage';
import ArtObjectPageModal from './components/ArtObjectPageComponents/ArtObjectPageModal';

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
    const isModal = !!(
      location.state &&
      location.state.modal &&
      this.previousLocation !== location // not initial render
    )
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

export default ModalSwitch;
