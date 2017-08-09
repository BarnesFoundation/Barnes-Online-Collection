A17.Behaviors.SocialSharingButtons = function(container) {
  // Doc: https://code.area17.com/mike/a17-js-helpers/wikis/A17-Behaviors-socialSharingButtons

  var socialWindowRef;

  function pageUrl() {
    return A17.Helpers.escapeString(container.getAttribute('data-share-url') || window.location.href);
  }

  function pageTitle() {
    return A17.Helpers.escapeString(document.title);
  }

  function buildFacebookURL() {
    return 'https://www.facebook.com/sharer/sharer.php?u=' + pageUrl();
  }

  function buildGoogleURL() {
    return 'https://plus.google.com/share?' +
           'url=' + pageUrl();
  }

  function buildTwitterURL() {
    return 'https://twitter.com/intent/tweet?' +
           'url=' + pageUrl() +
           '&text=' + pageTitle() +
           '&via=' + (container.getAttribute('data-share-twitter-via') || '');
  }

  function buildPinterestrURL() {
    return 'http://pinterest.com/pin/create/button/?' +
           'url=' + pageUrl() +
           '&media=' + A17.Helpers.escapeString(document.getElementsByTagName('img')[0].getAttribute('src') || '') +
           '&description=' + pageTitle();
  }

  function openWindow(url, options) {
    if(!options) {
      options = {};
    }

    var width  = options.width || 575;
    var height = options.height || 400;
    var left   = (window.outerWidth  - width)  / 2;
    var top    = (window.outerHeight - height) / 2;
    var opts   = 'status=1' +
                 ',width='  + width  +
                 ',height=' + height +
                 ',top='    + top    +
                 ',left='   + left;
    if (socialWindowRef && !socialWindowRef.closed) {
      socialWindowRef.close();
    }
    setTimeout(function() {
      socialWindowRef = window.open(url, 'A17', opts);
      socialWindowRef.opener = null;
    }, 250);
  }

  function addListener(arr, func) {
    var arrLength = arr.length;
    for (var i = 0; i < arrLength; i++) {
      arr[i].addEventListener('click', func, false);
    }
  }

  function removeListener(arr, func) {
    var arrLength = arr.length;
    for (var i = 0; i < arrLength; i++) {
      arr[i].removeEventListener('click', func);
    }
  }

  // social networks
  function facebook(event) {
    event.preventDefault();
    var url = buildFacebookURL();
    openWindow(url);
  }

  function twitter(event) {
    event.preventDefault();
    var url = buildTwitterURL();
    openWindow(url, {height:253});
  }

  function googleplus(event) {
    event.preventDefault();
    var url = buildGoogleURL();
    openWindow(url, {width:515, height:505});
  }

  function pinterest(event) {
    event.preventDefault();
    var url = buildPinterestrURL();
    openWindow(url, {width:750, height:675});
  }

  function email(event) {
    event.preventDefault();
    openWindow(this.href);
  }

  function permalink(event) {
    var button = event.currentTarget;
    var input = button.closest('li').querySelector('[data-social-sharing-permalink-input]');
    var copiedCopy = button.getAttribute('data-copy-copied');
    var originalCopy = button.getAttribute('data-copy-original');

    event.preventDefault();
    input.select();

    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      input.blur();
      button.innerHTML = copiedCopy;

      // Reset the wording of the button after 3 seconds
      setTimeout(function() {
        button.innerHTML = originalCopy;
      }, 3000);

    } catch(error) {
      window.prompt('Copy to clipboard: Ctrl+C, Enter', URL);
    }
  }

  // init clicks
  this.init = function() {
    addListener(container.querySelectorAll('[data-social-sharing-facebook]'), facebook);
    addListener(container.querySelectorAll('[data-social-sharing-twitter]'), twitter);
    addListener(container.querySelectorAll('[data-social-sharing-googleplus]'), googleplus);
    addListener(container.querySelectorAll('[data-social-sharing-pinterest]'), pinterest);
    addListener(container.querySelectorAll('[data-social-sharing-email]'), email);
    addListener(container.querySelectorAll('[data-social-sharing-permalink]'), permalink);
  };

  // destroy
  this.destroy = function() {
    removeListener(container.querySelectorAll('[data-social-sharing-facebook]'), facebook);
    removeListener(container.querySelectorAll('[data-social-sharing-twitter]'), twitter);
    removeListener(container.querySelectorAll('[data-social-sharing-googleplus]'), googleplus);
    removeListener(container.querySelectorAll('[data-social-sharing-pinterest]'), pinterest);
    removeListener(container.querySelectorAll('[data-social-sharing-email]'), email);
    removeListener(container.querySelectorAll('[data-social-sharing-permalink]'), permalink);
  };
};
