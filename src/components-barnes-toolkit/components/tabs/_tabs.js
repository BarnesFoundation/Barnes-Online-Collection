/**
 * Tabs
 * @uses Flickity v2.0.5 http://flickity.metafizzy.co/
 */

A17.Behaviors.Tabs = function(container) {

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
    cellAlign: 'center',
    cellSelector: '.m-tabs__item',
    contain: false,
    imagesLoaded: false,
    pageDots: false,
    percentPosition: false,
    prevNextButtons: false,
    resize: true
  };

  /**
   * @param {object}
   * Cached versions of child elements
   */
  var _cachedElements = {
    list: container.querySelector('.m-tabs__list'),
    listItems: container.querySelectorAll('.m-tabs__item'),
    selectedLink: container.querySelector('.m-tabs__link[aria-current="true"]')
  };

  /**
   * _getCurrentIndex
   * Work out in the index of the currently selected menu item
   * @return {int}
   */
  function _getCurrentIndex () {
    var activeLi = null;
    var activeIndex = 0;

    if (_cachedElements.selectedLink){
      activeLi = _cachedElements.selectedLink.parentNode;
      activeIndex = [].slice.call(activeLi.parentNode.children).indexOf(activeLi);
    }

    return activeIndex;
  }

  /**
   * _resetFlickity
   * Hmm, ooookay. Something in flickity causes it to incorrectly set the widths
   * unless we trigger a resize event. Then once the event has been triggered
   * we have to recalcuate the widths and kill Flickity if we do not need it
   * e.g. if all listItems fit on the screen in a row
   * Use a setTimeout because Flickity doesn't provide a callback after its
   * initialised in the version we are using here.
   *
   * @return {void}
   */
  function _resetFlickity () {

    if(_flkty !== null) {

      window.dispatchEvent(new Event('resize'));

      setTimeout(function(){

        var listWidth = 0;
        var i = 0;

        for(i = 0; i < _cachedElements.listItems.length; i++) {
          listWidth = listWidth + _cachedElements.listItems[i].offsetWidth
        }

        if (_cachedElements.list.offsetWidth > listWidth) {
          _flkty.destroy();
        }

      }, 100);

    }

  }

  /**
   * init
   *
   * @return {void}
   */
  function _init() {

    // Only set Flickity *if* we need to e.g. if all listItems fit do not fit on the screen in a row
    if (_cachedElements.list.offsetWidth >= document.documentElement.clientWidth) {
      _flktyOptions.initialIndex = _getCurrentIndex();

      if (_cachedElements.listItems.length > 1 && _cachedElements.listItems.length === (_flktyOptions.initialIndex + 1)) {
        _flktyOptions.cellAlign = 'right';
      } else if (_cachedElements.listItems.length > 1 && _flktyOptions.initialIndex === 0) {
        _flktyOptions.cellAlign = 'left';
      }

      _flkty = new Flickity(_cachedElements.list, _flktyOptions);
      _resetFlickity();
    }

  }

  /**
   * destroy
   *
   * @return {void}
   */
  this.destroy = function() {
    // remove specific event handlers
    if (_flkty) {
      _flkty.destroy();
    }

    // remove properties of this behavior
    A17.Helpers.purgeProperties(this);
  };

  this.init = function() {
    _init();
  };
};
