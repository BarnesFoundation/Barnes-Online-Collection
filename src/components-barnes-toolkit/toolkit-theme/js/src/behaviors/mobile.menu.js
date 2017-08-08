
Guides.Behaviors.mobileMenu = function ( container ) {
  var $body = $('body').removeClass('is-loading');

  var min_width = 960; // original min width is 680px (see scss/utils/_variables)
  var min_screen_width = min_width + 440 + 1;

  enquire.register("screen and (min-width: " + min_screen_width + "px)", {
    match: function() {
      $body.addClass('is-menu-expanded');
    },

    unmatch: function () {
      $body.removeClass('is-menu-expanded');
    }
  });

  container.on('click', function ( event ) {
    event.preventDefault();
    if ($body.hasClass('is-menu-expanded')) {
      $body.removeClass('is-menu-expanded');
      $('.content-container').off('touchstart');
    } else {
      $body.addClass('is-menu-expanded');
      $('.content-container').on('touchstart', function ( e ) { e.preventDefault(); container.trigger('click'); });
    }
  });

};



