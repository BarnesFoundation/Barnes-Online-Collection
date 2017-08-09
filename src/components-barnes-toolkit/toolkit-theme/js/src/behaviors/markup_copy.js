
Guides.Behaviors.copy_markup = function () {
  var clipboard = new Clipboard('.js-copy');

  clipboard.on('success', function(e) {
    $trigger = $(e.trigger);
    $previousText = $trigger.text();
    $trigger.text('Copied!');
    window.setTimeout(function () {
      $trigger.text($previousText);
    }, 2000);
  });

};