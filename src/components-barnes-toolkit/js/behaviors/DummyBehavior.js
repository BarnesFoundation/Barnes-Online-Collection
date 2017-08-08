A17.Behaviors.DummyBehavior = function(container) {

  /**
   * _handleClicks
   *
   *  @return {void}
   */
  function _handleClicks() {
    // action
  }

  /**
   * _handleResized
   *
   *  @return {void}
   */
  function _handleResized() {
    // action
  }

  /**
   * _init
   *
   *  @return {void}
   */
  function _init() {
    // add specific event handlers
    container.addEventListener('click', _handleClicks, false);
    document.addEventListener('resized', _handleResized);
  }

  this.destroy = function() {
    // remove specific event handlers
    container.removeEventListener('click', _handleClicks);
    document.removeEventListener('resized', _handleResized);

    // remove properties of this behavior
    A17.Helpers.purgeProperties(this);
  };

  this.init = function() {
    _init();
  };
};
