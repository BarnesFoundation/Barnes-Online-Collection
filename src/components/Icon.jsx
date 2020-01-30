import React from 'react';

export default ({ svgId, classes }) => (
  <svg className={`icon icon-${svgId} ${classes}`}>
    <use xlinkHref={`#icon-${svgId}`}></use>
  </svg>
);
