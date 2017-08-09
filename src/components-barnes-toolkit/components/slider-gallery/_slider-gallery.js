/**
 * Slider Gallery
 * @uses Flickity v2.0.5 http://flickity.metafizzy.co/
 */

A17.Behaviors.SliderGallery = function(container) {

  /**
   * @var {object}
   * Placeholder for our Flickity slider
   */
  var _flkty = null;

  /**
   * @var {object}
   * Our options for our slider
   * @see http://flickity.metafizzy.co/options.html
   */
  var _flktyOptions = {
    cellAlign: 'left',
    cellSelector: '.m-card-artwork',
    contain: true,
    imagesLoaded: true,
    percentPosition: false,
    prevNextButtons: false,
    pageDots: false
  };

  function _init() {
    _flkty = new Flickity(container, _flktyOptions);
  }

  this.destroy = function() {
    // remove specific event handlers
    _flkty.destroy();

    // remove properties of this behavior
    A17.Helpers.purgeProperties(this);
  };

  this.init = function() {
    _init();
  };
};
