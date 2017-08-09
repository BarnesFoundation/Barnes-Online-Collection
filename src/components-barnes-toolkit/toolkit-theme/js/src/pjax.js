
/* ---------------------------------- */

/*
Area 17 - This javascript is the main
javascript for the pjax actiuons (using barba.js).
*/

/* ---------------------------------- */

Guides.latest_click_element = null;
Guides.Transitions = {};

Guides.Transitions.HideShow = Barba.BaseTransition.extend({

  start: function() {
    Promise
      .all([this.newContainerLoading, this.showLoader()])
      .then(this.finish.bind(this));
  },

  showLoader: function() {
    var self = this;
    var deferred = Barba.Utils.deferred();

    $('html').addClass("html--loading");

    deferred.resolve();

    return deferred.promise;
  },

  goBackToTop: function() {
    $(window).scrollTop(0);
  },

  finish: function() {
    var self = this;

    self.goBackToTop();

    $('html').removeClass("html--loading");

    self.done();
  }
});

$(function() {

  // Barba JS options
  Barba.Pjax.ignoreClassLink = "no-pjax";
  Barba.Pjax.Dom.wrapperId = "pjax";
  Barba.Pjax.Dom.containerClass = "content-wrapper";

  Barba.Dispatcher.on('linkClicked', function(el) {
    Guides.latest_click_element = el;
  });

  // NO pjax on links inside
  function deactivateLinks(container) {
    var links = container.getElementsByTagName("a");

    [].forEach.call(links, function(link) {
      console.log(link);
      link.classList.add(Barba.Pjax.ignoreClassLink);
    });
  }

  deactivateLinks(document.querySelector('.' + Barba.Pjax.Dom.containerClass));

  // Init Transitions
  Barba.Pjax.getTransition = function() {
    return Guides.Transitions.HideShow;
  };

  Barba.Pjax.start();

  // Reload behaviors after page finished loading
  // Reload picturefill after content is ready
  Barba.Dispatcher.on("transitionCompleted", function(currentStatus) {
    var container = document.querySelector('.' + Barba.Pjax.Dom.containerClass);
    if(container) {
      Guides.LoadBehavior(container);
      deactivateLinks(container);
    }
  });
});
