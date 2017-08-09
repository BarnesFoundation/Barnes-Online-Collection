A17.Behaviors.Newsletter = function(container) {

  /**
   * @var {object}
   * Cached versions of child elements
   */
  _cachedElements = {
    success: container.querySelector('.m-newsletter__success'),
    loading: container.querySelector('.m-newsletter__loading'),
    signup: container.querySelector('.m-newsletter__signup')
  };

  /**
   * _showSection
   * Make sure a given section is shown (make sure it's `visible` to screen-readers too)
   * @param {obejct} section - the block of code in the DOM to be shown
   *
   * @return {void}
   */
  function _showSection(section) {
    section.setAttribute('aria-hidden', 'false');
    section.classList.remove('hidden');
  }

  /**
   * _hideSection
   * Make sure a given section is hidden (make sure it's `invisible` to screen-readers too)
   * @param {obejct} section - the block of code in the DOM to be hidden
   *
   * @return {void}
   */
  function _hideSection(section) {
    section.setAttribute('aria-hidden', 'true');
    section.classList.add('hidden');
  }

  /**
   * _sendAJAXCall
   *
   * @return {void}
   */
  function _sendAJAXCall() {

    var DONE = 4; // readyState 4 means the request is done.
    var OK = 200; // status 200 is a successful return.
    var xhr = new XMLHttpRequest();
    var data = serialize(container);
    var formAction = container.getAttribute('action');

    xhr.open('POST', formAction);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('HTTP_X_REQUESTED_WITH', 'XMLHttpRequest');
    xhr.setRequestHeader('X-Requested-By', 'XMLHttpRequest');
    xhr.send(data);

    xhr.onreadystatechange = function () {

      _hideSection(_cachedElements.loading);

      if (xhr.readyState === DONE) {
        if (xhr.status === OK) {
          _showSection(_cachedElements.success);
          _hideSection(_cachedElements.signup);
        } else {
          _showSection(_cachedElements.signup);
        }
      }
    };

  }

  /**
   * _handleSubmit
   * Trigger an AJAX call on submit BUT only if the form is valid. If the form
   * isn't (HTML5) valid then our other global behavior 'FormValidate' will
   * help us with this - so don't worry abut error handling here.
   * @param {object} e - JavaScript event
   *
   * @return {void}
   */
  function _handleSubmit(e) {

    if(container.checkValidity() === true){

      e.preventDefault();

      _showSection(_cachedElements.loading);
      _hideSection(_cachedElements.signup);

      // Send AJAX call to back-end
      _sendAJAXCall();

    }
  }

  /**
   * _init
   *
   * @return {void}
   */
  function _init() {
    // add specific event handlers
    container.addEventListener('submit', _handleSubmit, false);
  }

  this.destroy = function() {
    // remove specific event handlers
    container.removeEventListener('submit', _handleSubmit);

    // remove properties of this behavior
    A17.Helpers.purgeProperties(this);
  };

  this.init = function() {
    _init();
  };
};
