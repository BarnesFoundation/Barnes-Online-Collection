
Guides.Functions.resizeIframeWidth = function ( container ) {
  var iframe = null;
  var dropdown = container.getElementsByTagName('select');
  var i = 0;
  var width = '';

  if (buttons.length === 0){
    return;
  }

  // Resize the iframe when the user changes the dropdown
  dropdown[0].addEventListener('change', function(e) {

    // As the iframe is loaded in dynamically onload we can't cache it beforehand
    iframe = container.parentNode.getElementsByTagName('iframe')[0];

    if (e.currentTarget.value !== '') {
      iframe.style.width = e.currentTarget.value + 'px';
    } else {
      iframe.style.width = '';
    }

    // Reset the height. Wait a second to allow our transition to finish
    // FYI without the transition macOS Safari goes nuts when making the iframe smaller
    setTimeout(function(){
      Guides.Helpers.resizeIframe(iframe.id);
    }, 550);

  });


  // After a resize - disable the resize <option> if it's smaller than the iframe
  // width - we do not want the user trying to resize the iframe to a size
  // larger than can be handled
  $(document).on('resized', function() {

    if (container.parentNode) {

      var options = dropdown[0].querySelectorAll('option');
      var firstIframe = document.querySelector('.result > iframe');
      var iframeWidth = firstIframe.offsetWidth;
      var marginOfError = 2; // account for the 2px keyline around the iframe

      for (i = 0; i < options.length; i++) {

        if (options[i].value - marginOfError > iframeWidth) {
          options[i].disabled = 'disabled';
        } else {
          options[i].removeAttribute('disabled');
        }
      }

    }

  });


};
