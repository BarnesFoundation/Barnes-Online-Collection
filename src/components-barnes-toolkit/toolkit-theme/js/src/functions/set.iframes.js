Guides.Functions.setIframes = function ( result_placeholder ) {

  // Helper functions
  function generateId () { return (Math.random()+1).toString(36).substring(2); }

  // Insert the results
  var resultTemplate = document.querySelector('.result-template').innerHTML;
  while(resultTemplate.indexOf('\\/script') !== -1){
      // .replace seems to only replace 1 occurrence of '\/script' at a time, even if using regex with the 'g' flag
      resultTemplate = resultTemplate.replace('\\/script', '/script');
  }

  var parent = result_placeholder.parentNode;
  var content = resultTemplate
      .replace('[[body]]', result_placeholder.innerHTML)
      .replace('[[onload]]', 'parent.Guides.Helpers.resizeIframe(window.frameElement.id)');
  var iframe = document.createElement('iframe');
  parent.appendChild(iframe);
  iframe.setAttribute('id', generateId());
  iframe.setAttribute('height', 0);

  // Create the responsive resize nav
  var nav = parent.querySelector('.result__resizenav');
  var i = 0;
  var iframeWidth = iframe.offsetWidth;
  var buttons = [
    {
      label: 'iPhone 5 (portrait)',
      size: 322
    },
    {
      label: 'iPhone 6 (portrait)',
      size: 377
    },
    {
      label: 'iPhone 6 Plus (portrait)',
      size: 416
    },
    {
      label: 'Tablet',
      size: 652
    },
    {
      label: 'iPad (portrait)',
      size: 768
    },
    {
      label: 'iPad (landscape)',
      size: 1026
    },
    {
      label: 'Laptop',
      size: 1202
    },
    {
      label: 'Desktop',
      size: 1602
    },
    {
      label: 'Default',
      size: ''
    }
  ];

  var dropdown = document.createElement('select');
  dropdown.setAttribute('name', 'resizer');

  for (i = 0; i < buttons.length; i++) {
    var option = document.createElement('option');
    option.innerHTML = buttons[i].label;
    option.value = buttons[i].size;
    if (buttons[i].size === '') {
      option.selected = 'selected';
    }

    // Disable the option if it's smaller than the iframe width
    // commented out because it is a pain to re-enable these options
    // if the user resizes the browser
    if (buttons[i].size > iframeWidth) {
      option.disabled = 'disabled';
    }

    dropdown.appendChild(option);
  }
  nav.appendChild(dropdown);

  Guides.Functions.resizeIframeWidth(nav);

  // Write the iframe contents
  var doc = iframe.contentWindow.document;
  doc.open();
  doc.write(content);
  doc.close();
};
