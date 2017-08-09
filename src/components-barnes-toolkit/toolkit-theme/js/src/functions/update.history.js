Guides.Functions.updateUrl = function ( str ) {
  var newHash = "#" + str;

  if (newHash !== window.location.hash) {
    var stateObj = {
      title: str,
      url: window.location.pathname + newHash
    }

    window.history.pushState(stateObj, str, newHash);
  }
}
