import React from 'react';

export default ({ svgId, classes, ...props }) => {
  let className = `icon icon-${svgId}`;
  if (classes) className = `${className} ${classes}`;

  return (
    <svg className={className} {...props}>
      <use xlinkHref={`#icon-${svgId}`}></use>
    </svg>
  );
};
