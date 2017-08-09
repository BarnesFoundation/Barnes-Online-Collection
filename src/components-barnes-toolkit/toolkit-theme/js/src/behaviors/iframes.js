
Guides.Behaviors.iframes = function ( container ) {
  var iframes = container.find('.result-placeholder');
  iframes.each(function() {
    Guides.Functions.setIframes(this);
  });
};
