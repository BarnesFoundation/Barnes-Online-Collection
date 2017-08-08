
Guides.Behaviors.scroll_to_start_target = function ( ) {
	var hash = window.location.hash || '';

  if ($('html').hasClass('ie')) {
    hash = '#' + $(Guides.$SECTION[0]).attr('id');
  }

  if (hash.length > 0) {
    var $startAnchor =  $(hash);

    window.location.hash = '';

    $(window).on('load', function() {
      Guides.Functions.updateUrl(hash.slice(1));
      Guides.Functions.updateTitle($startAnchor);
      Guides.Functions.scrollToTarget($startAnchor, 100, true);
      Guides.Functions.setNavActive( $('a[href="' + hash + '"]').get(0) );
    });
  }

}
