import React from 'react';
import { sentenceCase } from 'change-case';

const ArtObjectCaption = ({ title, people, highlight }) => {
  // If there are any highlights, take the first key string.
  let highlightText = (highlight && Object.keys(highlight).length)
    ? Object.keys(highlight)[0]
    : null;

  // Remove any trailing properties.
  if (highlightText && highlightText.includes('.')) highlightText = highlightText.slice(highlightText, highlightText.indexOf('.'));

  // Convert from camelCase to "Sentence case".
  if (highlightText) highlightText = sentenceCase(highlightText);

  return (
    <div className="art-object-caption">
      <h2 className="h2 font-simple-heading">
        {title}
      </h2>
      {people &&
        <h3 className="h3 color-light">
          {people}
        </h3>
      }
      {highlight &&
        <h4 className="h4 color-light">
          ({highlightText})
        </h4>
      }
    </div>
  );
};

export default ArtObjectCaption;
