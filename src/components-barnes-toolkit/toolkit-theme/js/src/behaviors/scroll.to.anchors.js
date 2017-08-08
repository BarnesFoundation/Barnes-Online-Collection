Guides.Behaviors.scrollToAnchors = function ( container ) {
  $('a[href^="#"]', container).on('click', function ( event ) {
    event.preventDefault();

    var that = this;
    var href = that.getAttribute('href');
    var target = $(href);
    // Set active
    Guides.Functions.scrollToTarget(target);
    Guides.Functions.setNavActive(this);
    Guides.Functions.updateUrl(href.slice(1));

    // Close menu if open and mobile
    // receives event after scroll to target function finishes
    // this exists here to close over the click event's target
    $(document).on("closemenu", closeMenu)

    function closeMenu (e) {
      if (window.innerWidth < 1025 && !that.nextElementSibling && $("body").hasClass("is-menu-expanded")) {
        $("body").removeClass("is-menu-expanded");
      }

      $(document).off("closemenu")
    }
  });
};
