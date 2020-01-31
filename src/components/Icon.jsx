import React from 'react';

export default ({ svgId, classes }) => {
  let className = `icon icon-${svgId}`;
  if (classes) className = `${className} ${classes}`;

  return (
    <svg className={className}>
      <use xlinkHref={`#icon-${svgId}`}></use>
    </svg>
  );
}
