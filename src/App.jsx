// Import normalize and base styles first so that component styles can override them if needed.
import 'normalize.css';
import './index.css';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import LandingPage from './layouts/LandingPage/LandingPage';
import ArtObjectPage from './layouts/ArtObjectPage/ArtObjectPage';

import history from './history';

class App extends Component {
  // componentDidMount() {
  //   fetch('/api/objects/5227');
  // }

  render() {
    return (
      <Provider store={this.props.store}>
        <Router history={history}>
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route exact path="/objects/:id" component={ArtObjectPage} />
            <Route exact path="/objects/:id/:panel" component={ArtObjectPage} />
          </Switch>
        </Router>
      </Provider>
    );
  }
}

App.propTypes = {
  store: PropTypes.object.isRequired
};

export default App;
