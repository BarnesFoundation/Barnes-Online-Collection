A17.Behaviors.TagList = function(container) {

  /**
   * @param {object}
   * Cached versions of child elements
   */
  var _cachedElements = {
    list: container.querySelector('ul'),
    select: container.querySelector('select')
  };

  /**
   * _submit
   * Go to the option value
   *
   * @return {void}
   */
  function _submit(e) {
    window.location = _cachedElements.select.value;
  }

  /**
   * init
   *
   * @return {void}
   */
  function _init() {
    // Change select
    _cachedElements.select.addEventListener('change', _submit, false);
  }

  /**
   * destroy
   *
   * @return {void}
   */
  this.destroy = function() {
    // remove specific event handlers
    // Change select
    _cachedElements.select.removeEventListener('change', _submit, false);

    // remove properties of this behavior
    A17.Helpers.purgeProperties(this);
  };

  this.init = function() {
    _init();
  };
};
