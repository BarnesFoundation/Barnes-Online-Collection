/**
 * On submit we want to check to see if our form is
 * valid. `Valid` means, does it pass basic HTML5 rules
 * like `required` fields not being NULL or number fields
 * not exceeding their `max` value.
 *
 * If the form is not valid we don't submit it. Instead
 * we loop through the separate form fields showing/unshowing
 * the relevant inline error message.
 *
 * We also show a global error message which could sit at the top of the form or above the submit button
 *
 * Note: This JS could and should be cleaned-up.
 */

A17.Behaviors.FormValidate = function(container) {

  /**
   * @param {object}
   * Cached versions of child elements
   */
  var _cachedElements = {
    globalError: container.querySelector('.form-field__error--summary'),
    fieldsErrors: container.querySelectorAll('.form-field__error'),
    fieldsErrorsInline: container.querySelectorAll('.form-field__error:not(.form-field__error--summary)')
  };

  /**
   * @param {object}
   */
  var _classes = {
    hidden: 'hidden'
  };

  /**
   * _appendErrorList
   *
   * @param {array} $errors a lit of DOMElements containing our inline error messages
   * @return {void}
   */
  function _appendErrorList (errors) {

    var i;
    var errorsList = document.createElement('ul');
    var errorsListItem;
    var errorsListItemLink;

    if (errors.length > 0) {

      for (i = 0; i < errors.length; i++) {
        errorsListItem = document.createElement('li');
        errorsListItemLink = document.createElement('a');
        errorsListItemLink.href = '#' + errors[i].closest('.form-field').querySelector('input, select, textarea').id;
        errorsListItemLink.appendChild(document.createTextNode(errors[i].innerHTML));
        errorsListItem.appendChild(errorsListItemLink);

        errorsList.appendChild(errorsListItem);
      }

      if (_cachedElements.globalError) {
        _cachedElements.globalError.appendChild(errorsList);
      }

      // If there's only one error we probably don't need inline errors
      if (errors.length === 1) {
        _cachedElements.fieldsErrorsInline[0].classList.add(_classes.hidden);
        _cachedElements.fieldsErrorsInline[0].setAttribute('aria-hidden', 'true');
      }

    }

  }


  /**
   * _hideAllErrors
   *
   * @return {void}
   */
  function _hideAllErrors () {

    var errorList;

    // Hide top error summary
    if (_cachedElements.globalError) {
      _cachedElements.globalError.setAttribute('tabindex', '-1');
      _cachedElements.globalError.classList.add(_classes.hidden);
      _cachedElements.globalError.setAttribute('aria-hidden', 'true');

      errorList = _cachedElements.globalError.querySelector('ul');

      if (errorList) {
        _cachedElements.globalError.removeChild(errorList);
      }

    }

    // Hide inline errors
    for (i = 0; i < _cachedElements.fieldsErrors.length; i++){
      _cachedElements.fieldsErrors[i].classList.add(_classes.hidden);
      _cachedElements.fieldsErrors[i].setAttribute('aria-hidden', 'true');
    }

  }

  /**
   * _handleSubmit
   *
   * @param {object} event
   * @return {void}
   */
  function _handleSubmit(e) {

    var $field = null;
    var $fields = container.querySelectorAll('input, select, textarea');
    var $error = null;
    var i = 0;
    var $errors = [];

    // Assume we're valid and hide *all* errors
    _hideAllErrors();

    // Now check the form and if it isn't valid then show them
    if(container.checkValidity() !== true){

      // Unhide the main error message
      if (_cachedElements.globalError) {
        _cachedElements.globalError.classList.remove(_classes.hidden);
        _cachedElements.globalError.setAttribute('aria-hidden', 'false');

        // For a11y reasons - set the focus to the error summary so a screen-reader user
        // knows that an error has occurred
        _cachedElements.globalError.focus();
       }

      // Unhide inline error message for individual invalid fields
      for (i = 0; i < $fields.length; i++){

        if($fields[i].checkValidity() !== true){
          $field = $fields[i].closest('.form-field');
          $error = $field.querySelector('.form-field__error');

          $field.classList.add('form-field--error');

          if ($error) {

            $error.classList.remove(_classes.hidden);
            $error.setAttribute('aria-hidden', 'false');
            $errors.push($error);

            if (i === 0 && !_cachedElements.globalError) {
              $error.focus();
            }

          }

        }
      }

      _appendErrorList($errors);

      // Stop form from submitting
      if (e) {
        e.preventDefault();
      } else {
        return;
      }
    }

  }

  /**
   * _init
   *
   *  @return {void}
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
