
Guides.Behaviors.navigate = function ( container ) {
  Guides.$PREV.on('click.navigate', { direction: 'previous' }, navigateToPage);
  Guides.$NEXT.on('click.navigate', { direction: 'next' }, navigateToPage);

  // Navigate to page
  function navigateToPage ( event ) {

    var $target = $(event.target),
        currentSection,
        indexOffset,
        pageOffset;

    // If target is a link, prevent default action.
    // $target.is('a') && event.preventDefault() && event.stopPropagation();
    event.preventDefault();

    switch ( event.data.direction ) {
      case 'previous':
        if ( Guides.CURRENT_ID > 0 ) {
          Guides.CURRENT_ID--;
        }
        break;

      case 'next':
        if ( Guides.CURRENT_ID < (Guides.TOTAL - 1) ) {
          Guides.CURRENT_ID++;
        }
        break;

      default:
        return;
    }

    currentSection = Guides.Helpers.getElement();
    Guides.Functions.scrollToTarget( currentSection );
    Guides.Functions.setNavActive( $('a[href="#' + currentSection.attr('id') + '"]') );
  }

  $(document).on( 'keyup.navigate', function ( event ) {
    switch ( event.which ) {
      case 75: // previous
        Guides.$PREV.trigger('click.navigate');
        break;

      case 74: // next
        Guides.$NEXT.trigger('click.navigate');
        break;
    }
  });

};
