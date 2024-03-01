import React from "react";
import CommonWrap from "./CommonWrap";
import { ui } from "./shared/config";

const ReactGA = require("react-ga");

ReactGA.initialize(ui.googleAnalyticsID);

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
      <CommonWrap>
        <WrappedComponent {...props} />
      </CommonWrap>
    );
  };

  return Wrapper;
};

export default routeWrapper;
