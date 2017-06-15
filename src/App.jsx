import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Layout from './components/Layout';
import ArtObject from './components/ArtObject/ArtObject';
import history from './history';

import 'normalize.css';
import './index.css';

class App extends Component {
  // componentDidMount() {
  //   fetch('/api/objects/5227');
  // }

  render() {
    return (
      <Provider store={this.props.store}>
        <Router history={history}>
          <Switch>
            <Route exact path="/" component={Layout} />
            <Route exact path="/objects/:id" component={ArtObject} />
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
