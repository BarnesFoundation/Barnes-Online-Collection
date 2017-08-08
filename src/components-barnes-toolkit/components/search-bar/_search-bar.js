A17.Behaviors.SearchBar = function(container) {

  /**
   * @var {boolean}
   * Our state. Is the nav active (e.g. visible) or not?
   */
  var _active = false;

  /**
   * @var {object}
   * The CSS hook class we will add to the <html>
   */
  var _activeClass = 'search-bar-active';

  /**
   * @var {int}
   * The scrollTop position the user was at before the search was shown
   */
  var _userScrollTop = 0;

  /**
   * @var {object}
   * List of items that we are caching to speed up selection later
   */
  var _cachedElements = {
    showButtons: document.querySelectorAll('[data-search-show]'),
    hideButtons: document.querySelectorAll('[data-search-hide]'),
    overlay: document.querySelector('[data-search-overlay]'),
    header: document.querySelector('.g-header'),

    // Top level elements on the page which aren't the nav
    otherElements: document.querySelectorAll('nav, main, footer, .skip-link'),

    // the search input box - we will need this if the users clicks the search icon to open the nav
    searchInput: container.querySelector('input[type="search"]')
  };

  /**
   * @var {object}
   * Storage for the button that was clicked to show the nav
   * We will return user focus back here afterwards
   */
  var _clickedShowButton = null;

  /**
   * @var {object}
   * List of items in the container which can be receive focus
   */
  var _focusableEls = container.querySelectorAll('a, button, input');

  /**
   * _tabTrap
   * Trap tab focus inside the nav when it is active. This aids accessibility
   * because sighted keyboard users can otherwise tab into links/elements outside of
   * the nav which they cannot see which cna be confusing.
   * @see: https://hiddedevries.nl/en/blog/2017-01-29-using-javascript-to-trap-focus-in-an-element
   *
   * @param {object} e
   *
   * @return {void}
   */
  function _tabTrap(e) {

    var firstFocusableEl = _focusableEls[0];
    var lastFocusableEl = _focusableEls[(_focusableEls.length - 1)];
    var KEYCODE_TAB = 9;
    var isTabPressed = (e.key === 'Tab' || e.keyCode === KEYCODE_TAB);

    // If the nav isn't visible OR the user isn't tabbing then stop checking
    if (!isTabPressed || _active !== true){
      return;
    }

    // We have determined that user is tabbing but are they
    // A: holding down the shift key to tab backwards or B: tabbing forwards (no shift key)
    if (e.shiftKey){
      if (document.activeElement === firstFocusableEl){
        lastFocusableEl.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusableEl){
        firstFocusableEl.focus();
        e.preventDefault();
      }
    }

  }

  /**
   * _tabToggle
   * Don't allow the nav to be tabbed to if it is not visible.
   * Elements with a tabindex="-1" attribute/value combo cannot receive focus
   * so we add/remove this attribute/value when necessary
   *
   * @return {void}
   */
  function _tabToggle() {

    var i = 0;

    for (i = 0; i < _focusableEls.length; i++) {
      if (_active === true) {
        _focusableEls[i].removeAttribute('tabindex');
      } else {
        _focusableEls[i].setAttribute('tabindex', '-1');
      }
    }

  }

  /**
   * _focusInput
   *
   * @return {void}
   */
  function _focusInput() {
    _cachedElements.searchInput.focus();
  }

  /**
   * markButtonsAsNotExpanded
   * Set all the buttons that open the menu to have the correct aria-expanded attribute
   *
   * @return {void}
   */
  function _markButtonsAsNotExpanded() {

    var i;

    for (i = 0; i < _cachedElements.showButtons.length; i++) {
      _cachedElements.showButtons[i].setAttribute('aria-expanded', 'false');
    }

  }

  /**
   * _toggle
   * Allow (or don't allow) screen-readers to read the rest of the page's content
   * @param {boolean} hide
   *
   * @return {void}
   */
  function _toggleOtherElementsFromSR(hide) {

    var i;

    for (i = 0; i < _cachedElements.otherElements.length; i++) {
      _cachedElements.otherElements[i].setAttribute('aria-hidden', hide);
    }

  }

  /**
   * _show
   * Show the nav
   * @param {object} e - the clicked item
   *
   * @return {void}
   */
  function _show(e) {

    var currentTarget = e.currentTarget;
    var transitionEnd;

    e.preventDefault();

    _userScrollTop = document.getElementsByTagName('body')[0].scrollTop;

    document.documentElement.classList.add(_activeClass);

    _active = true;
    _clickedShowButton = e.currentTarget;

    // Let nav items be tabbed to
    _tabToggle();

    // Mark open buttons as expanded
    for (i = 0; i < _cachedElements.showButtons.length; i++) {
      _cachedElements.showButtons[i].setAttribute('aria-expanded', 'true');
    }

    // Let screen-readers read out the contents if visible
    container.setAttribute('aria-hidden', 'false');

    // Do not screen-readers to read the rest of the page's content
    _toggleOtherElementsFromSR('true');

    // Trap the user’s tabbing inside the active nav
    container.addEventListener('keydown', _tabTrap, false);

    _focusInput();

  }

  /**
   * _hide
   * Hide the nav
   *
   * @return {void}
   */
  function _hide() {

    document.documentElement.classList.remove(_activeClass);

    _active = false;

    // Prevent nav items being tabbed to
    _tabToggle();

    _markButtonsAsNotExpanded();

    // Don't let screen-readers read out the contents if hidden
    container.setAttribute('aria-hidden', 'true');

    // Allow screen-readers to read the rest of the page's content
    _toggleOtherElementsFromSR('false');

    // Let user tab around again
    container.removeEventListener('keydown', _tabTrap);

    // Set focus back to the first show nav button
    _clickedShowButton.focus();

    // Send the suer back where they where before they clicked to show the search bar
    document.getElementsByTagName('body')[0].scrollTop = (_userScrollTop - _cachedElements.header.offsetHeight);
    _userScrollTop = 0;

  }

  /**
   * _backgroundClick
   * If the nav is showing and we are *not* clicking anywhere on the nav itself then
   * @return {void}
   */
  function _backgroundClick(e) {

    if (_active === true && e.target === _cachedElements.overlay){
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
   * _init
   * Set-up
   *
   * @return {void}
   */
  function _init() {

    var i = 0;

    _tabToggle();

    // Don't let screen-readers read out the contents if hidden
    container.setAttribute('aria-hidden', 'true');

    _markButtonsAsNotExpanded();

    // Set some event listeners

    // Show nav on click of button
    for (i = 0; i < _cachedElements.showButtons.length; i++) {
      _cachedElements.showButtons[i].addEventListener('click', _show, false);
    }

    // Hide nav on click of hide button
    for (i = 0; i < _cachedElements.hideButtons.length; i++) {
      _cachedElements.hideButtons[i].addEventListener('click', _hide, false);
    }

    // Hide on Esc key
    window.addEventListener('keydown', _escPress, false);

    // Hide on click background
    document.getElementById('a17').addEventListener('click', _backgroundClick, false);

  }

  this.destroy = function() {

    var i = 0;

    // remove specific event handlers
    for (i = 0; i < _cachedElements.showButtons.length; i++) {
      _cachedElements.showButtons[i].removeEventListener('click', _show);
    }

    for (i = 0; i < _cachedElements.hideButtons.length; i++) {
      _cachedElements.hideButtons[i].removeEventListener('click', _hide);
    }

    document.removeEventListener('keypress', _escPress);
    container.removeEventListener('keydown', _tabToggle);
    document.getElementById('a17').removeEventListener('click', _backgroundClick);

    // remove properties of this behavior
    A17.Helpers.purgeProperties(this);
  };

  // Exposed functions
  this.init = function() {
    _init();
  };
};
