// Import normalize and base styles first so that component styles can override them if needed.
import 'normalize.css';
import './index.css';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import LandingPage from './layouts/LandingPage/LandingPage';
import ArtObjectPage from './layouts/ArtObjectPage/ArtObjectPage';
import CombinedPage from './layouts/CombinedPage';
import ScrollToTop from './ScrollToTop';
import history from './history';
import routeWrapper from './routeWrapper';

class App extends Component {
  render() {
    return (
      <Provider store={this.props.store}>
        <Router history={history}>
          <ScrollToTop>
            <Switch>
              <Route exact path="/" component={routeWrapper(LandingPage)} />
              <Route exact path="/preview/objects/:id" component={routeWrapper(CombinedPage)} />
              <Route exact path="/objects/:id" component={routeWrapper(ArtObjectPage)} />
              <Route exact path="/objects/:id/:panel" component={routeWrapper(ArtObjectPage)} />
            </Switch>
          </ScrollToTop>
        </Router>
      </Provider>
    );
  }
}

App.propTypes = {
  store: PropTypes.object.isRequired
};

export default App;
