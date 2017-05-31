import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Layout from './components/Layout';

import 'normalize.css';
import './index.css';

class App extends Component {
  // componentDidMount() {
  //   fetch('/api/objects/5227');
  // }

  render() {
    return (
      <Provider store={this.props.store}>
        <Router>
          <Route path="/" component={Layout} />
        </Router>
      </Provider>
    );
  }
}

App.propTypes = {
  store: PropTypes.object.isRequired
};

export default App;
