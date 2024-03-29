// Import normalize and base styles first so that component styles can override them if needed.
import "normalize.css";
import "./index.css";

// just for you, IE11
// We could make this more efficient by only loading this for IE11 and below.
import "babel-polyfill";

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Provider } from "react-redux";
import { Router, Route } from "react-router-dom";
import { setSearchAssets } from "./searchAssets";
import history from "./history";
import RouteSwitcher from "./routeSwitcher";
import routeWrapper from "./routeWrapper";

class App extends Component {
  /**
   * Async method to fetch searchAssets file.
   */
  componentDidMount() {
    setSearchAssets();
  }

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
  store: PropTypes.object.isRequired,
};

export default App;
