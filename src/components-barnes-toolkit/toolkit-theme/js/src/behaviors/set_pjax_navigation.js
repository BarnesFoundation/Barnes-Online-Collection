
Guides.Behaviors.set_pjax_navigation = function ( container ) {
  var slug = container.data('current');
  var el = $('a[data-slug=' + slug + ']');

  var selector_klass = "sidebar__item";
  var current_klass = "current_page_item";

  if(el.length) {
    // conditionally add new active class
    var $items = $('.' + selector_klass);
    var $parent = $(el).parent();
    var $childList = $(el).parent().parent();

    // remove current state
    $items.removeClass(current_klass);

    if($parent.hasClass(selector_klass)) $parent.addClass(current_klass);

    // a ghetto way of opening the parent block in the nav if needed
    if ( $childList.hasClass('children') ) {
      $childList.closest('.' + selector_klass).addClass(current_klass);
    }

    // Update previous and next link
    var index = 0;
    var current_href = "";
    var $current = null;
    var $prev = null;
    var $next = null;
    var disabledClass = 'is-disabled';
    var prevlink = "#";
    var nextlink = "#";

    Guides.$PREV.attr("href", prevlink);
    Guides.$NEXT.attr("href", nextlink);
    Guides.$PREV.addClass(disabledClass);
    Guides.$NEXT.addClass(disabledClass);

    $items.each(function(i) {
      if($(this).hasClass(current_klass)) {
        $current = $(this);
        index = i;
      }
    })

    current_href = getHref($current);

    if($current) {
      Guides.CURRENT_ID = index;
      Guides.TOTAL = $items.length;

      if(index > 0) $prev = $items.eq(index - 1);
      if(index < ($items.length - 1)) $next = $items.eq(index + 1);

      // get prev link
      // double check if previous link is the same as the current one
      if($prev) {
        prevlink = getHref($prev);

        if(current_href === prevlink) {
          $prev = $items.eq(index - 2);

          if($prev) prevlink = getHref($prev);
        }
      }

      // get next link
      if($next) nextlink = getHref($next);

      if(prevlink != "#") {
        Guides.$PREV.attr("href", prevlink);
        Guides.$PREV.removeClass(disabledClass);
      }

      if(nextlink != "#") {
        Guides.$NEXT.attr("href", nextlink);
        Guides.$NEXT.removeClass(disabledClass);
      }
    }
  }

  function getHref(item) {
    return item.find('a:first').attr('href');
  }

};
