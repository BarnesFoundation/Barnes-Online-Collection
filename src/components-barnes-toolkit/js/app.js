/*

  A17

  Doc: // Doc: https://code.area17.com/a17/fe-boilerplate/wikis/js-app

*/

// set up a master object
var A17 = window.A17 || {};

// HTML4 browser?
if (!A17.browserSpec || A17.browserSpec === 'html4') {
  // lets kill further JS execution of A17 js here
  throw new Error('HTML4');
}

// set up some objects within the master one, to hold my Helpers and behaviors
A17.Behaviors = {};
A17.Helpers = {};
A17.Functions = {};
A17.currentMediaQuery = 'large';
A17.activeBehaviors = {};

// set up and trigger looking for the behaviors on DOM ready
A17.onReady = function(){

  // sort out which media query we're using
  A17.currentMediaQuery = A17.Helpers.getCurrentMediaQuery();

  // go go go
  A17.Helpers.manageBehaviors();

  // on resize, check
  A17.Helpers.resized();
};

document.addEventListener('DOMContentLoaded', function(){
  A17.onReady();
});

// make console.log safe
if (typeof console === 'undefined') {
  window.console = {
    log: function () {
      return;
    }
  };
}
