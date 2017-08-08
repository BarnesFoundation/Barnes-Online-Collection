
Guides.Behaviors.scroll = function ( container ) {
  var myScroller = false,
      currentScrollPosition = Guides.Helpers.getScroll(myScroller).y,
      lastScrollTop = 0,
      firstLoad = true,
      currentSection;

  // set up iScroll if needed
  if ( Modernizr.touch ) {
    myScroller = { y: 0 };

    setTimeout(function () {
      myScroller = new IScroll(container, {
        // tap: true
        mouseWheel: true,
        scrollbars: true
      });
    }, 100);

    // stop native scroll
    document.addEventListener('touchmove', function ( event ) {
      event.preventDefault();
    });
  }

  // listen for an event to refresh iScroll
  document.addEventListener('resized', function ( event ) {
    if (myScroller) {
      setTimeout(function () {
          myScroller.refresh();
      }, 10);
    }
  });


  function detectDirection () {
    var st = window.pageYOffset,
        direction;

    if ( st > lastScrollTop ) {
      // scrolling down
      direction = -1;
    }
    else if ( st < lastScrollTop ){
      // scrolling up
      direction = 1;
    }
    else {
      direction = 0;
    }

    // updated lastscrolltop with new current top
    lastScrollTop = st;

    // return the direction
    return direction;
  }


  // animation loop, gets
  (function animationLoop () {

    // get normalised scroll position
    var newScrollPos = Guides.Helpers.getScroll(myScroller).y;

    if ( newScrollPos !== currentScrollPosition ) {
      currentScrollPosition = newScrollPos;

      Guides.DIRECTION = detectDirection();
      // console.log( 'Guides.DIRECTION', Guides.DIRECTION );

      currentSection = Guides.Helpers.getElement();
      Guides.Functions.updateTitle( currentSection, firstLoad );
      firstLoad = false;

      $(document).trigger({ type: 'scrolled', position: currentScrollPosition });
    }

      window.requestAnimationFrame( animationLoop );
  })();
};
