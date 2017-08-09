A17.Behaviors.HomeHeroClick = function(container) {

  /**
   * @param {object}
   * Cached versions of child elements
   */
  var _cachedElements = {
    // All the `hero` elements on the page.
    link: container.querySelector('.o-hero__title a'),
    image: container.querySelector('.o-hero__image')
  };

  /**
   * _goToLink
   *
   * @return {void}
   */
  function _goToLink () {
    window.location = _cachedElements.link.href;
  }

  /**
   * _init
   *
   *  @return {void}
   */
  function _init() {
    _cachedElements.image.addEventListener('click', _goToLink, false);
  }

  this.destroy = function() {

    _cachedElements.image.removeEventListener('click', _goToLink);

    // remove properties of this behavior
    A17.Helpers.purgeProperties(this);
  };

  this.init = function() {
    _init();
  };
};
