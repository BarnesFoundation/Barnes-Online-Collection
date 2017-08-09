/**
 * Product Gallery
 * @uses Flickity v2.0.5 http://flickity.metafizzy.co/
 */
A17.Behaviors.ProductGallery = function(container) {

  /**
   * @var {object}
   * Placeholder for our Flickity slider
   */
  var _flkty = null;

  /**
   * @var {object}
   * The thumbnails (well the parent <li>) of them
   * We need this so we can only init if there are multiples
   */
  var _thumbs = container.querySelectorAll('.m-product__media');

  /**
   * @var {object}
   * Our options for our slider
   * @see http://flickity.metafizzy.co/options.html
   */
  var _flktyOptions = {
    cellAlign: 'left',
    contain: true,
    imagesLoaded: true,
    prevNextButtons: false
  };

  function _init() {

    if(_thumbs.length > 1) {
      _flkty = new Flickity(container, _flktyOptions);
    }
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
