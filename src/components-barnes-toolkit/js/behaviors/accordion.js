A17.Behaviors.Accordion = function(container) {
  // Doc: https://code.area17.com/mike/a17-js-helpers/wikis/A17-Behaviors-accordion

  /**
   * @param {object}
   * The tab DOM elements in this container.
   */
  var tabs = container.querySelectorAll('[role="tab"]');

  /**
   * @param {boolean}
   * The tab content e.g. the contne tthat is toggled by the tabs above.
   */
  var tabPanels = container.querySelectorAll('[role="tabpanel"]');

  /**
   * @param {boolean}
   * Attribute set via HTML. if true then only one tab is allowed to be open at once
   */
  var closeOthers = (container.getAttribute('data-accordion-close-others') === 'true');

  /**
   * @param {object}
   * The active tab DOM element
   */
  var openedItem;

  /**
   * @param {string}
   * A list of elements that can receive focus
   */
  var _focusString = 'a, area, object, input, select, textarea, button, iframe, [tabindex]';

  /*
   * _getContent(id)
   *
   * Returns the associated tabpanel content Node.
   *
   * @param (tab Node) The header Node that contains `aria-controls`
   *
   * @return Node
   *
  */
  function _getContent(tab) {
    if (!tab.content) {
      tab.content = container.querySelector('#'+tab.getAttribute('aria-controls'));
    }
    return tab.content;
  }

  /*
   * _isOpen(tab)
   *
   * @param (tab Node) Node you want to check if it is open.
   *
   * @return Boolean
   *
  */
  function _isOpen (tab) {
    return tab.getAttribute('aria-selected') === 'true';
  }

  /*
   * _calculateHeight()
   *
   * Thrashes the layout to calculate the height of each tabpanel and sets
   * data-height attribute in it.
   *
   * @return N/A
   *
  */
  function _calculateHeight () {
    var tabPanelsLength = tabPanels.length;
    for (var i = 0; i < tabPanelsLength; i++) {
      var item = tabPanels[i];

      // Initial height calculation
      item.style.display = 'block';
      item.style.maxHeight = 'initial';
      item.setAttribute('data-height', item.offsetHeight+'px');

      // Keep opened item if resizing
      if (item.getAttribute('aria-hidden') === 'false') {
        item.style.maxHeight = item.getAttribute('data-height');
      } else {
        item.style.maxHeight = '0px';
      }
    }
  }

  /*
   * _close(item)
   *
   * Hides the content of a given tab.
   *
   * @param (tab Node) The tab that should have it’s content hidden.
   *
   * @return N/A
   *
  */
  function _close (tab) {
    var content = _getContent(tab);

    tab.setAttribute('aria-selected', false);
    tab.setAttribute('aria-expanded', false);
    content.style.maxHeight = '0px';
    content.setAttribute('aria-hidden', true);

    openedItem = null;
  }

  /*
   * _open(item)
   *
   * Displays the content of a given tab.
   *
   * @param (tab Node) The tab that should have it's content displayed.
   *
   * @return N/A
   *
  */
  function _open (tab) {
    var content = _getContent(tab);

    if (closeOthers && openedItem) {
      _close(openedItem);
    }

    var tabsLength = tabPanels.length;
    for (var i = 0; i < tabsLength; i++) {
      tabs[i].getAttribute('tabindex', -1);
    }

    tab.setAttribute('aria-selected', true);
    tab.setAttribute('aria-expanded', true);
    tab.setAttribute('tabindex', 0);
    content.setAttribute('aria-hidden', false);
    content.style.maxHeight = content.getAttribute('data-height');

    openedItem = tab;
  }

  /*
   * _changeSelection(oldTab, newTab)
   *
   * Function that handles the blurring and focusing of a new tab
   *
   * @param(oldTab Node) The soon-to-be previous tab
   *
   * @param(newTab Node) The new tab to be focused
   *
   * @return N/A
   *
  */
  function _changeSelection(oldTab, newTab) {
    oldTab.setAttribute('tabindex', -1);
    oldTab.blur();

    newTab.focus();
    newTab.setAttribute('tabindex', 0);
  }

  /*
   * _selectNewTab(target, direction)
   *
   * Functions that handles the keyboard selection of a new tab.
   *
   * @param (target Node) Node from where the key event originated
   *
   * @param (direction string) Direction of the selection. Only accepts
   * 'prev' and 'next' string lowercase values.
   *
   * @return N/A
  */
  function _selectNewTab (target, direction) {
    var newTab,
      curNdx;

    curNdx = A17.Helpers.getIndex(target, tabs);

    switch(direction) {
      case 'prev':
        newTab = (curNdx === tabs.length-1) ? tabs[0] : tabs[curNdx+1];
        break;

      case 'next':
        newTab = (curNdx === 0) ? tabs[tabs.length-1] : tabs[curNdx-1];
        break;
    }

    _changeSelection(target, newTab);
  }

  /*
   * _handleClicks
   *
   * Handle clicks and trigger toggle if required.
   *
   * @param (e) the click event
   *
   * @return N/A
   *
  */
  function _handleClicks (e) {
    if (e.target.getAttribute('aria-controls')) {
      _toggleOpen(e.target);
    }
  }

  /*
   * _unsetFocussability
   *
   * Make all inactive tabs unfocussability. This is for accessibility purposes...
   * We don't want non-screen-reader-keybaord-using users to be tabbing to hidden tab content
   * because it's a waste of time for the and it is confusing. Imagine a hidden tabcontent block
   * with 50 links inside it and how annoying that would be to tab through.
   *
   * @return N/A
   *
  */
  function _unsetFocussability () {

    var i = 0;
    var ii = 0;
    var elements = '';

    for(i = 0; i < tabPanels.length; i++) {
      elements = tabPanels[i].querySelectorAll(_focusString);

      for (ii = 0; ii < elements.length; ii++) {
        elements[ii].setAttribute('tabindex', '-1');
      }
    }
  }

  /*
   * _setFocussability
   *
   * Make active tabs focusable elements focusaable again and vice versa.
   * Because we unset the ability to focus with _unsetFocussability above
   * we now need to allow user to tab to things when a tab is active/visible.
   *
   * @return N/A
   *
  */
  function _setFocussability (tab) {

    var i = 0;
    var content = _getContent(tab);
    var elements = content.querySelectorAll(_focusString);
    var isOpen = _isOpen(tab);

    if (elements) {
      for (i = 0; i < elements.length; i++) {
        if (isOpen === true) {
          elements[i].removeAttribute('tabindex');
        } else {
          elements[i].setAttribute('tabindex', '-1');
        }
      }
    }

  }

  /*
   * _toggleOpen
   *
   * Function that toggles a tab between opened and closed states.
   *
   * @param (tab Node) The tab you want to toggle.
   *
   * @return N/A
   *
  */
  function _toggleOpen (tab) {
    if (_isOpen(tab)) {
      _close(tab);
    } else {
      _open(tab);
    }
    _setFocussability(tab);
  }

  /*
   * _handleKeyDown (e)
   *
   * Function to handle the pressing of keys and preventing their default
   * action if they are part of the UI.
   *
   * @param (e Event) Javascript event triggered by listener
   *
   * @return N/A
   *
  */
  function _handleKeyDown (e) {
    if (e.target.getAttribute('aria-controls')) {
      switch(e.keyCode) {
        case A17.Helpers.keyCodes.down:
        case A17.Helpers.keyCodes.right:
          e.preventDefault();
          e.stopPropagation();
          _selectNewTab(e.target, 'prev');
          break;
        case A17.Helpers.keyCodes.up:
        case A17.Helpers.keyCodes.left:
          e.preventDefault();
          e.stopPropagation();
          _selectNewTab(e.target, 'next');
          break;
        case A17.Helpers.keyCodes.space:
        case A17.Helpers.keyCodes.enter:
          e.preventDefault();
          e.stopPropagation();
          _toggleOpen(e.target);
          break;
      }
    }
  }

  /*
   * _init()
   *
   * Function that kickstarts the accordion and binds the events.
   *
   * @return N/A
   *
  */
  function _init () {
    _calculateHeight();
    _unsetFocussability();
    container.addEventListener('keydown', _handleKeyDown, false);
    container.addEventListener('click', _handleClicks, false);
    document.addEventListener('resized', _calculateHeight);

    // after images have all loaded let's recalculate
    window.onload = function () {
      _calculateHeight();
    };

  }

  /*
   * destroy()
   *
   * Removes all the event listeners etc.
   *
   * @return N/A
   *
  */
  this.destroy = function() {
    // remove specific event handlers
    container.removeEventListener('keydown', _handleKeyDown);
    container.removeEventListener('click', _handleClicks);
    document.removeEventListener('resized', _calculateHeight);

    // remove properties of this behavior
    A17.Helpers.purgeProperties(this);

    // remove variables/functions of this behavior
    this._getContent = undefined;
    this._isOpen = undefined;
    this.__calculateHeight = undefined;
    this._open = undefined;
    this._close = undefined;
    this._changeSelection = undefined;
    this._selectNewTab = undefined;
    this._handleClicks = undefined;
    this._toggleOpen = undefined;
    this._handleKeyDown = undefined;
    this._init = undefined;
    this.tabs = undefined;
    this.tabPanels = undefined;
    this.closeOthers = undefined;
    this.openedItem = undefined;
  };

  /*
   * init()
   *
   * Public init, fires private _init
   *
   * @return N/A
   *
  */
  this.init = function() {
    _init();
  };
};
