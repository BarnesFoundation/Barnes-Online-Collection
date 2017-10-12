// Import normalize and base styles first so that component styles can override them if needed.
import 'normalize.css';
import './index.css';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import history from './history';
import RouteSwitcher from './RouteSwitcher';
import routeWrapper from './routeWrapper';

class App extends Component {
  render() {
    return (
      <Provider store={this.props.store}>
        <Router history={history}>
          <Route component={routeWrapper(RouteSwitcher)} />
        </Router>
      </Provider>
    );
  }
}

App.propTypes = {
  store: PropTypes.object.isRequired
};

export default App;
