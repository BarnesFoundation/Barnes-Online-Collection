
Guides.Helpers.resizeIframe = function(id) {
    setTimeout(function () {
        var iframe = document.getElementById(id);
        // var h = iframe.contentWindow.document.body.scrollHeight;
        var h = iframe.contentWindow.document.body.offsetHeight;
        var parent = iframe.parentNode;
        var nav = parent.querySelector('.result__resizenav');

        if(h > 0) h = h + 2;

        iframe.height = "";
        iframe.height = h + "px";

        if(parseInt(iframe.height) === 0) {
          $("#" + id).remove();
          nav.remove();
        }
        else {
          iframe.style.display = "block";
        }

        $(document).trigger('resized');
    }, 50);
};
