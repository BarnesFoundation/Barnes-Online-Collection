
Guides.Functions.scrollToTarget = function ( target, duration, firstLoad) {
  var spacing = parseInt( $('.content-container').css('padding-top'), 10 ),
      offset = ( Guides.Helpers.getType(target) ? spacing : 100),
      targetOffset = ( typeof target === 'number' ) ? target : target.offset().top - offset,
      startScroll = window.scrollY || window.pageYOffset,
      change = (targetOffset - startScroll),
      scrollDuration = duration || 250;
  var stepsTotal = Modernizr.mobile || Modernizr.tablet ? 1 : scrollDuration / (1000/60) * 1 + 1, // one step on touch, 60fps scroll on desktop
      stepSize = Math.round(change / stepsTotal),
      currentStep = 0;

  $(document).trigger('stopspying'); // stop the scroll spy updating the nav

  var req = requestAnimationFrame(step); // go go go

  function step () {

    if ( currentStep < stepsTotal ) {
      currentStep++;
      var scrollPos = window.scrollY || window.pageYOffset;
      window.scrollTo(0, scrollPos + stepSize);
      req = requestAnimationFrame(step);
    }
    else {
      // re-enable scrollspy
      $(document).trigger('startspying');
      $(document).trigger('closemenu');
      cancelAnimationFrame(req);
    }
  }
};
