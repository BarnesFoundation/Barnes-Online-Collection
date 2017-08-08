A17.Behaviors.Alert = function(container) {

  /**
   * @param {string}
   * We should have a cookie called 'alert' set by our CMS
   */
  var _cookie = document.cookie.replace(/(?:(?:^|.*;\s*)alert\s*\=\s*([^;]*).*$)|^.*$/, "$1");

  /**
   * @param {string}
   * the string/value we will look for to determine whether to show our alert or not
   */
  var _cookieUpdated = container.getAttribute('data-alert-updated');

  /**
   * @param {object}
   * Cached versions of child elements
   */
  var _cachedElements = {
    button: container.querySelector('.m-alert__btn')
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
  var _active = true;

  /**
   * @param {object}
   * Lets us compare dates
   * Source: http://stackoverflow.com/questions/497790
   */
  var _dates = {
    convert: function(d) {
      // Converts the date in d to a date-object. The input can be:
      //   a date object: returned without modification
      //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
      //   a number     : Interpreted as number of milliseconds
      //                  since 1 Jan 1970 (a timestamp)
      //   a string     : Any format supported by the javascript engine, like
      //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
      //  an object     : Interpreted as an object with year, month and date
      //                  attributes.  **NOTE** month is 0-11.
      return (
        d.constructor === Date ? d :
        d.constructor === Array ? new Date(d[0], d[1], d[2]) :
        d.constructor === Number ? new Date(d) :
        d.constructor === String ? new Date(d) :
        typeof d === "object" ? new Date(d.year, d.month, d.date) :
        NaN
      );
    },
    compare: function(a, b) {
      // Compare two dates (could be of any type supported by the convert
      // function above) and returns:
      //  -1 : if a < b
      //   0 : if a = b
      //   1 : if a > b
      // NaN : if a or b is an illegal date
      // NOTE: The code inside isFinite does an assignment (=).
      return (
        isFinite(a = this.convert(a).valueOf()) &&
        isFinite(b = this.convert(b).valueOf()) ?
        (a > b) - (a < b) :
        NaN
      );
    }
  }

  /**
   * _padBody
   * Don't let the position:fixed alert sit over any content
   *
   * @return {void}
   */
  function _padBody() {
    document.documentElement.style.paddingBottom = container.offsetHeight + 'px';
  }

  /**
   * _unpadBody
   * Undo the work of _padBody
   *
   * @return {void}
   */
  function _unpadBody() {
    document.documentElement.style.paddingBottom = 0;
  }

  /**
   * _hide
   * Hide the nav
   * then set a cookie (lasting 3 days) that won't show the alert again.
   *
   * @return {void}
   */
  function _hide() {
    var d = new Date();
    var cookieExpiry = '';

    // hide/reset visual appearance
    container.classList.add(_inactiveClass);
    container.setAttribute('aria-hidden', 'true');
    _active = false;
    _unpadBody();

    // set cookie
    d.setTime(d.getTime() + 72*60*60*1000);
    cookieExpiry = d.toGMTString();
    _cookie = _cookieUpdated;
    document.cookie = 'alert=' + _cookie +'; expires=' + cookieExpiry + '; path=/';
  }

  /**
   * _isAlertOld
   * Work out if the alert is old or not by comparing the date on the alert itself
   * and the date in the cookie
   *
   * @return {boolean}
   */
  function _isAlertOld() {
    var alertIsOld = false;
    var cookieUpdatedDate = new Date(_cookieUpdated);
    var cookieSetDate = new Date(_cookie);
    var comparedDates = _dates.compare(cookieUpdatedDate, cookieSetDate);

    if (comparedDates === 0 || comparedDates === -1) {
      alertIsOld = true;
    }

    return alertIsOld;
  }

  /**
   * _init
   *
   *  @return {void}
   */
  function _init() {

    if (_isAlertOld()) {
      _hide();
    } else {
      _cachedElements.button.addEventListener('click', _hide, false);
      _padBody();
    }
  }

  this.destroy = function() {
    // remove specific event handlers
    _cachedElements.button.removeEventListener('click', _hide, false);

    // remove properties of this behavior
    A17.Helpers.purgeProperties(this);
  };

  this.init = function() {
    _init();
  };
};
