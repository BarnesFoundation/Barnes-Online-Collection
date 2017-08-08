
Guides.Behaviors.search = function ( container ) {
  var $trigger = $('.js-search-toggle');

  $trigger.on('click', function ( event ) {
    event.preventDefault();
    container.toggleClass('is-search-active');
  });
};
