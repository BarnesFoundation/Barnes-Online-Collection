
Guides.Helpers.getScroll = function ( iscroll ) {
  // normalise scroll positions between browser native scrolling and iscroll
  var y;

  if (Modernizr.touch && iscroll) {
    y = iscroll.y * -1;
  }
  else {
    y = $('html, body').scrollTop() || $(document).scrollTop();
  }

  return { y: y };
};
