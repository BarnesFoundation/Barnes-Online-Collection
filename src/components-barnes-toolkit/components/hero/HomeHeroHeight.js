A17.Behaviors.HomeHeroHeight = function(container) {

  /**
   * @param {object}
   * Cached versions of elements
   */
  var _cachedElements = {
    image: container.querySelector('.o-hero__image'),
    header: document.querySelector('.g-header'),
    mobileBar: document.querySelector('.m-mobile-options'),
    firstHero: container.parentNode.querySelector(':first-child')
  };

  /**
   * _setHeight
   * Note: don't run on 'resize' because that will trigger the iOS Chrome bug
   * where it recalculates the height when the address bar vanishes on scroll.
   *
   * @return {void}
   */
  function _setHeight () {
    var height = screen.height;
    var mq = A17.Helpers.getCurrentMediaQuery();
    var isChrome = /CriOS/.test(navigator.userAgent);
    var addressBarHeight = 40;
    var isAndroid = /Android/.test(navigator.userAgent);
    var isIOS = /iPhone/.test(navigator.userAgent);
    var magicOffset = 50; // lets just add a little offset to line-up the first hero

    // don't run on shrunken desktop browsers
    if (!isAndroid && !isIOS) {
      return
    }

    // if it's Chrome lets take off the height of the address bar
    if (isChrome) {
      addressBarHeight = 20;
    }

    // only small screens needs this treatment
    // bigger screens respect 100vh better and don't the same <header> style
    if (mq === 'small' || mq === 'xsmall') {

      // our first hero needs to be slightly smaller to account for extra browser chrome
      // and the <header> being visible on load
      if (container == _cachedElements.firstHero) {
        height = height - (_cachedElements.header.offsetHeight + _cachedElements.mobileBar.offsetHeight - magicOffset);

        if (isChrome) {
          addressBarHeight = 70;
        } else {
          addressBarHeight = 87;
        }
      }

      height = height - addressBarHeight;

      container.style.minHeight = null;
      container.style.maxHeight = null;
      container.style.height = height + 'px';
      _cachedElements.image.style.height = height + 'px';
    } else {
      container.style.height = null;
      _cachedElements.image.style.height = null;
    }
  }

  /**
   * _init
   *
   *  @return {void}
   */
  function _init() {
    _setHeight();
    window.addEventListener('orientationchange', _setHeight, false);
  }

  this.destroy = function() {
    window.addEventListener('orientationchange', _setHeight);

    // remove properties of this behavior
    A17.Helpers.purgeProperties(this);
  };

  this.init = function() {
    _init();
  };
};
