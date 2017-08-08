A17.Behaviors.EmbedResponsive = function(container) {

  /**
   * @param {object}
   * Cached versions of child elements
   */
  var _cachedElements = {
    embed: container.querySelector('iframe')
  };

  /**
   * _setRatio
   * check the width and height, work out the aspect ratio then set the
   * padding-bottom CSS value to the item.
   *
   *  @return {void}
   */
  function _setRatio() {

    var height = parseInt(_cachedElements.embed.height, 10);
    var width = _cachedElements.embed.width;
    var ratioPercentage = 1;

    // Assumption: A width of 100% means this doesn't need to be responsive
    if (width === '100%') {
      container.classList.remove('embed-responsive');
    } else {
      ratioPercentage = (height/parseInt(width, 10)) * 100;
      container.style.paddingBottom = ratioPercentage + '%';
      _cachedElements.embed.height = '100%';
      _cachedElements.embed.width = '100%';
    }
  }

  /**
   * _init
   *
   *  @return {void}
   */
  function _init() {
    _setRatio();
  }

  this.destroy = function() {
    // remove properties of this behavior
    A17.Helpers.purgeProperties(this);
  };

  this.init = function() {
    _init();
  };
};
