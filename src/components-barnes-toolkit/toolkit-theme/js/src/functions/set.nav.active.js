
Guides.Functions.setNavActive = function ( el ) {
  // remove current state
  $('.sidebar__item').removeClass( 'current_page_item' );

  // conditionally add new active class
  if ( el !== undefined ) {
    var $childList = $(el).parent().parent();

    $(el).parent().addClass('current_page_item');


    if ( !$($(el).attr('href')).hasClass('has-content') ) {
      $(el).parent().find('.children li').eq(0).addClass('current_page_item');
    }

    // a ghetto way of opening the parent block in the nav if needed
    if ( $childList.hasClass('children') ) {
      $childList.parent().addClass('current_page_item');
    }

    var new_id = $(el).attr('href');
    var new_section = $($(el).attr('href'));
    var old_id = Guides.CURRENT_ID;

    Guides.CURRENT_ID = Guides.$SECTION.index(new_section);

    if(old_id != Guides.CURRENT_ID) {
      Guides.Functions.updateArrows();
    }

  }
};
