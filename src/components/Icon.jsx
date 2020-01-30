import React from 'react';

export default ({ svgId, classes }) => {
  console.log(svgId);
  return (
    <svg className={`icon icon-${svgId} ${classes}`}>
      <use xlinkHref={`#icon-${svgId}`}></use>
    </svg>
  );
};
