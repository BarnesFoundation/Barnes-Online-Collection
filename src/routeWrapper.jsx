import React, { Component } from 'react';

const ReactGA = require('react-ga');

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);

// with advice from https://github.com/ReactTraining/react-router/issues/4278
const routeWrapper = (WrappedComponent) => {
  const trackPage = (page) => {
    ReactGA.set({ page });
    ReactGA.pageview(page);
  };

  const Wrapper = (props) => {
    const page = props.location.pathname;
    trackPage(page);

    return (
      <WrappedComponent {...props} />
    );
  };

  return Wrapper;
};

export default routeWrapper;
