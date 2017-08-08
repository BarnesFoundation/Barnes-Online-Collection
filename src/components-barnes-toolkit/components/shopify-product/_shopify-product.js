A17.Behaviors.ProductGalleryThumbs = function(container) {

  /**
   * @param {object}
   * Cached versions of child elements
   */
  var _cachedElements = {
    thumbs: container.querySelectorAll('.m-product-gallery__thumb'),
    mainImage: container.querySelector('.m-product__gallery--shopify img')
  };

  /**
   * @param {string}
   */
  var _activeClass = 'm-product-gallery__thumb--active';

  /**
   * _setActive
   *
   * @param {object} item
   *
   *  @return {void}
   */
  function _setActive(item) {

    var i = 0;

    for (i = 0; i < _cachedElements.thumbs.length; i++) {
      _cachedElements.thumbs[i].classList.remove(_activeClass);
    }

    item.classList.add(_activeClass);

  }

  /**
   * _swapImage
   *
   * @param {object} event
   *
   * @return {void}
   */
  function _swapImage(event) {
    event.preventDefault();

    _cachedElements.mainImage.src = event.currentTarget.href;
    _setActive(event.currentTarget.closest('.m-product-gallery__thumb'));

  }

  /**
   * _init
   *
   *  @return {void}
   */
  function _init() {

    var i = 0;

    if (!container.querySelector('.' + _activeClass)) {
      _setActive(_cachedElements.thumbs[0]);
    }

    // Change image
    for (i = 0; i < _cachedElements.thumbs.length; i++) {
      _cachedElements.thumbs[i].querySelector('a').addEventListener('click', _swapImage, false);
    }

  }

  this.destroy = function() {
    // remove properties of this behavior
    A17.Helpers.purgeProperties(this);

    // Turn off change image
    for (i = 0; i < _cachedElements.thumbs.length; i++) {
      _cachedElements.thumbs[i].querySelector('a').removeEventListener('click', _swapImage);
    }
  };

  this.init = function() {
    _init();
  };
};
