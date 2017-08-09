A17.Behaviors.ViewMore = function(container) {

  /**
   * _handleClicks
   *
   *  @return {void}
   */
  function _handleClicks(e) {
    // action
    alert("What should this do? Load more via AJAX? if so, then how many and from where? Or does it load more that are present on the page but visually hidden?");

    e.preventDefault();

  }

  /**
   * _init
   *
   *  @return {void}
   */
  function _init() {
    container.addEventListener('click', _handleClicks, false);
  }

  this.destroy = function() {
    // remove specific event handlers
    container.removeEventListener('click', _handleClicks);

    // remove properties of this behavior
    A17.Helpers.purgeProperties(this);
  };

  this.init = function() {
    _init();
  };
};
