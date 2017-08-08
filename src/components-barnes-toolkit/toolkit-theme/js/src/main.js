
/* ---------------------------------- */

/*
Area 17 - This javascript is the main
javascript for the sites actions.
*/

/* ---------------------------------- */

var Guides = window.Guides || {};
Guides.Behaviors = {};
Guides.Helpers = {};
Guides.Functions = {};

// Global Vars
Guides.$SECTION = $('.post > h2, .post > h3');
Guides.$PREV = $('.js-prev');
Guides.$NEXT = $('.js-next');
Guides.TOTAL = Guides.$SECTION.length;
Guides.CURRENT_ID = 0;
Guides.DIRECTION = 0;
Guides.OFFSETVALUE = 100;

// look through the document (or ajax'd in content if "context" is defined) to look for "data-behavior" attributes.
// Initialize a new instance of the method if found, passing through the element that had the attribute
Guides.LoadBehavior = function ( context ) {
  var $context;

  if (context) {
    $context = (context instanceof window.jQuery) ? context : $(context);

    if ($context.data('behavior')) {
      var that = $context;
      $.each($context.data('behavior').split(' '), function (index, behaviorName) {
        Guides.Behaviors[behaviorName].apply(that, [$(that)]);
      });
    }
  }
  else {
    $context = $(document);
  }

  $context.find('*[data-behavior]').each(function () {
    var that = this;

    $.each($(this).data('behavior').split(' '), function (index, behaviorName) {
      if (!!Guides.Behaviors[behaviorName]) {
        Guides.Behaviors[behaviorName].apply(that, [$(that)]);
      }
    });
  });
};

// Set up throttled resize event
Guides.onResize = function () {
  var resize_timer;

  $(window).on('resize', function ( event ) {
    clearTimeout(resize_timer);
    resize_timer = setTimeout(function () {
      Guides.Helpers.resized();
    }, 250);
  });
};

$(function() {
  Guides.LoadBehavior();
  Guides.onResize();
  $('code').not('[data-language]').attr('data-language', 'generic');
});
