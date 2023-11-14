const BARNES_SETTINGS = {
  size: 50,
};

const ALL_MORE_LIKE_THIS_FIELDS = [
  "tags.tag.*",
  "tags.category.*",
  "color.palette-color-*",
  "color.average-*",
  "color.palette-closest-*",
  "title.*",
  "people.*",
  "people",
  "medium.*",
  "shortDescription.*",
  "longDescription.*",
  "visualDescription.*",
  "culture.*",
  "space",
  "light_desc_*",
  "color_desc_*",
  "comp_desc_*",
  "generic_desc_*",
  "period",
  "curvy",
  "vertical",
  "diagonal",
  "horizontal",
  "light",
];

const MORE_LIKE_THIS_FIELDS = [
  "people",
  "generic_desc_*",
  "curvy",
  "vertical",
  "diagonal",
  "horizontal",
  "light",
  "line",
];

const BASIC_FIELDS = [
  "id",
  "title",
  "people",
  "medium",
  "imageOriginalSecret",
  "imageSecret",
];

module.exports = {
  BASIC_FIELDS,
  MORE_LIKE_THIS_FIELDS,
  ALL_MORE_LIKE_THIS_FIELDS,
  BARNES_SETTINGS,
};
