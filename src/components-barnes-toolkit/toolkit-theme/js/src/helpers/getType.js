
// Check if element is top-level
Guides.Helpers.getType = function ( el ) {
  var htmlEl = $(el).get(0);

  return !!htmlEl ? htmlEl.tagName === 'H2' : false;
};
