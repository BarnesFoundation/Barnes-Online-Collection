import React, { Component } from 'react';

const ReactGA = require('react-ga');

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID, { debug: true,});

// with advice from https://github.com/ReactTraining/react-router/issues/4278
const withTracker = (WrappedComponent) => {
  const trackPage = (page) => {
    debugger;
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

export default withTracker;
