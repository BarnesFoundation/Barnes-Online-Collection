
Guides.Behaviors.revealAll = function ( container ) {
  container.on('click', function ( event ) {
    event.preventDefault();
    $('body').toggleClass('is-contents-expanded');
  });
};
