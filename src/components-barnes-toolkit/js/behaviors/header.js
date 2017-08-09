A17.Behaviors.header = function(container) {

  /**
   * @var {object}
   * Are we scrolling? in which direction?
   * use this in conjunction with requestAnimationFrame as opposed to
   * window.scroll(function(){}); as this performs better
   *
   * @return {int}
   */
  var _config = {
    // A cached scrollTop value
    top: window.scrolltop,

    // Are we scrolling up or down or not at all = false
    direction: 'down',

    // Class to be added/removed from <html> used as a CSS hook
    activeClass: 'header-unlocked',

    // Class to be added/removed from <html> used as a CSS hook
    activeClassHero: 'header-locked-hero',

    // Does this page have a hero?
    hasHero: document.documentElement.classList.contains('has-hero'),

    // set a value in px - this value will be the height of the header + Npx
    // after whch we will make the header white. This stops the header going white
    // whilst it is still in view and looking a little on first scroll
    headerOffset: 113
  };

  /**
   * @param {object}
   * Cached versions of child elements
   */
  var _cachedElements = {
    // All the `hero` elements on the page. We could have many. Later we
    // will want to work with the first one
    heroes: document.querySelectorAll('.o-hero, .o-exhibition-hero'),

    header: document.querySelectorAll('.g-header')
  };

  /**
   * checkScroll
   * Are we scrolling? in which direction?
   * use this in conjunction with requestAnimationFrame as opposed to
   * window.scroll(function(){}); as this performs better
   *
   * @return {void}
   */
  function _checkScroll() {

    var windowScrollTop = window.pageYOffset || parseInt(window.scrolltop, 10);

    // Work out if we are going down or up and set global values accordingly
    if(windowScrollTop > _config.top) {
      _config.direction = 'down';
    } else if(windowScrollTop < _config.top) {
      _config.direction = 'up';
    } else {
      _config.direction = false;
    }

    _config.top = windowScrollTop;

    // Work out when to (un/)lock the header
    if (_config.direction == 'up') {
      document.documentElement.classList.remove(_config.activeClass);
    } else if (_config.direction == 'down' && windowScrollTop > container.offsetHeight) {
      document.documentElement.classList.add(_config.activeClass);
    }


    // Ok if we have a hero on this page then we want the nav to have a specific class
    // when it’s out of view of the hero - WHY - because the design has it transparent which is
    // cool but then the header isn't very visible when it is `locked` in its scrolling up state.
    if (_config.hasHero && _cachedElements.heroes) {
      if ( windowScrollTop > _cachedElements.header[0].offsetHeight + _config.headerOffset) {
        document.documentElement.classList.add(_config.activeClassHero);
      } else {
        document.documentElement.classList.remove(_config.activeClassHero);
      }
    }

  }

  function _init() {

    // Automatically run this loop
    (function rafLoop(){
      _checkScroll();
      requestAnimationFrame(rafLoop, this);
    })();
  }

  this.destroy = function() {

    // remove properties of this behavior
    A17.Helpers.purgeProperties(this);
  };

  this.init = function() {
    _init();
  };
};
