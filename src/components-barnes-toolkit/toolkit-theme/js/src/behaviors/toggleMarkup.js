
Guides.Behaviors.toggleMarkup = function ( $bt ) {
  $bt.on('click', function() {
    $(this).parent().toggleClass("markup-active");

    $(document).trigger("resized");
  });
};