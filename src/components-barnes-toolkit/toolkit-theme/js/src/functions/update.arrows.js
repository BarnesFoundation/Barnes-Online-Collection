
Guides.Functions.updateArrows = function () {
  var disabledClass = 'is-disabled';

  // console.log( 'updateArrows Guides.CURRENT_ID', Guides.CURRENT_ID );

  if ( Guides.CURRENT_ID === 0 ) {
    Guides.$PREV.addClass(disabledClass);
    Guides.$NEXT.removeClass(disabledClass);
  }
  else if (Guides.CURRENT_ID >= (Guides.TOTAL - 1)) {
    Guides.$NEXT.addClass(disabledClass);
    Guides.$PREV.removeClass(disabledClass);
  }
  else if (Guides.CURRENT_ID <= (Guides.TOTAL - 1)) {
    Guides.$PREV.removeClass(disabledClass);
    Guides.$NEXT.removeClass(disabledClass);
  }
};
