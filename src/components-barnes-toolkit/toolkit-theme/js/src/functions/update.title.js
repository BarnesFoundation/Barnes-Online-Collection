
Guides.Functions.updateTitle = function ( el, init ) {
  var $elem = $('.primary-header__title'),
      str = el.text(),
      headerHeight = $elem.parent().height(),
      increment;

  if ( str.replace(/\s+/g, " ") !== $elem.find('span:first').text().replace(/\s+/g, " ") ) {
    increment = ( Guides.DIRECTION === 1 ) ? 0 : -(headerHeight * 2);

    // Toggle page headers
    Guides.$SECTION.removeClass('is-active');
    el.addClass('is-active');

    $elem.children('span:last, span:first').text(str);

    if ( Modernizr.mobile || Modernizr.tablet || init ) {
      $elem.find('.t-current').text(str);
      $elem.css('margin-top', -headerHeight);
    }
    else {
      $elem.stop().animate({ 'marginTop': increment }, 250, 'easeOutQuart', function () {
        $elem.find('.t-current').text(str);
        $elem.css('margin-top', -headerHeight);
      });
    }
  }

};
