import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Header from './Header';
import ArtObjectGrid from '../../components/ArtObjectGrid/ArtObjectGrid';
import Footer from '../../components/Footer/Footer';


class LandingPage extends Component {
  render() {
    console.log(this.props.history);
    return (
      <div className="app">
        <h1>LandingPage</h1>
        <Header />
        <ArtObjectGrid />
        <Footer />
      </div>
    );
  }
}

LandingPage.propTypes = {
  children: PropTypes.element
};

export default LandingPage;