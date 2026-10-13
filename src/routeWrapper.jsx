import React from "react";
import CommonWrap from "./CommonWrap";
import { initAnalytics, trackPageView } from "./analytics";

initAnalytics();

// with advice from https://github.com/ReactTraining/react-router/issues/4278
const routeWrapper = (WrappedComponent) => {
  const Wrapper = (props) => {
    const page = props.location.pathname;
    trackPageView(page);

    return (
      <CommonWrap>
        <WrappedComponent {...props} />
      </CommonWrap>
    );
  };

  return Wrapper;
};

export default routeWrapper;
