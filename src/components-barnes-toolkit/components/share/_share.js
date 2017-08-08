A17.Behaviors.Share = function(container) {

  /**
   * @param {object}
   * Cached versions of child elements
   */
  var _cachedElements = {
    list: container.querySelector('[data-behavior="SocialSharingButtons"]'),
    button: container.querySelector('.m-share__btn')
  };

  /**
   * @param {string}
   * The CSS hook we will toggle on/off
   */
  var _inactiveClass = 'js-hide';

  /**
   * @var {boolean}
   * Our state. Is the share list visible or not?
   */
  var _active = false;

  /**
   * _toggle
   * Show/Hide the child sharing list items on click
   *
   * @return {void}
   */
  function _toggle() {

    if (_active === false) {
      _show();
    } else {
      _hide();
    }

  }

  /**
   * _show
   * Show the nav
   *
   * @return {void}
   */
  function _show(e) {
    var focussableElements = _cachedElements.list.querySelectorAll('a, button, input');

    _cachedElements.list.classList.remove(_inactiveClass);
    _active = true;

    _cachedElements.button.setAttribute('aria-expanded', 'true');

    // Send focus to the list
    if (focussableElements) {
      focussableElements[0].focus();
    }
  }

  /**
   * _hide
   * Hide the nav
   *
   * @return {void}
   */
  function _hide() {
    _cachedElements.list.classList.add(_inactiveClass);
    _active = false;

    _cachedElements.button.setAttribute('aria-expanded', 'false');

    // Return focus to the toggle button
    _cachedElements.button.focus();
  }

  /**
   * _backgroundClick
   * If the nav is showing and we are *not* clicking anywhere on the nav itself then
   * @return {void}
   */
  function _backgroundClick(e) {

    if (_active === true && e.target.closest('[data-behavior="Share"]') !== container){
      _hide();
    }

  }

  /**
   * _escPress
   * If the nav is showing and the user clicks the Esc key then we want to hide the menu
   *
   * @return {void}
   */
  function _escPress(e) {

    var e = e || window.event;
    var escKey = 27;

    if (e.keyCode === escKey && _active === true){
      _hide();
    }

  }

  /**
   * init
   * Attach specific event handlers
   * @return {void}
   */
  function _init() {

    // Click button to show.hide
    _cachedElements.button.addEventListener('click', _toggle, false);

    // Hide on Esc key
    window.addEventListener('keydown', _escPress, false);

    // Hide on click background
    document.getElementById('a17').addEventListener('click', _backgroundClick, false);
  }

  this.destroy = function() {
    // remove specific event handlers
    _cachedElements.button.removeEventListener('click', _toggle);

    // Hide on Esc key
    window.removeEventListener('keydown', _escPress, false);

    // Hide on click background
    document.getElementById('a17').removeEventListener('click', _backgroundClick, false);

    // remove properties of this behavior
    A17.Helpers.purgeProperties(this);
  };

  this.init = function() {
    _init();
  };
};
