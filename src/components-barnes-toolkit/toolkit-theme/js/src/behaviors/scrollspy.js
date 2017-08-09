
Guides.Behaviors.scrollSpy = function ( container ) {
  var spy_on = $(container.data('scrollspy-on')),
      target_details,
      iframe_placeholder = $('*[data-iframes]'),
      target_iframe = [],
      spying = true,
      $lastPost = $('.post:last-child'),
      firstLoad = true;

  function init () {
    iframe_placeholder.each(function ( index, el ) {
      target_iframe.push({
        activated: false,
        top: $(el).offset().top
      });
    });

    gather();

    update({ position: window.scrollY });
  }

  function gather () {
    var spacing = parseInt( $('.content-container').css('padding-top'), 10 ),
        newIndex,
        offsetTop,
        extraOffset;

    target_details = [];

    spy_on.each(function ( index, el ) {
      if ( Guides.Helpers.getType(el) && !$(el).hasClass('has-content') ) {
        newIndex = index + 1;
      }

      offsetTop = ( index === newIndex ) ? target_details[newIndex-1].top : $(el).offset().top;
      extraOffset = ( Guides.Helpers.getType(el) && index === newIndex ) ? spacing : Guides.OFFSETVALUE;

      target_details.push({
        id: el.id,
        top: offsetTop - extraOffset
      });

    });

    iframe_placeholder.each(function ( index, el ) {
      target_iframe[index].top = $(el).offset().top;
    });

    // Account for last post
    // $lastPost.height( $(window).height() - $('.primary-footer').height() );

    // Adjust title margin
    $('.primary-header__title').css('margin-top', -($('.primary-header__slideout').height()));
  }

  function update ( event ) {
    if (!target_details) { return; }
    var hash = target_details[target_details.length-1].id;

    if ( spying ) {
      for ( var i = 0; i < target_details.length; i++ ) {
        if ( (target_details[i].top + 32) >= event.position ) {
          if ( i === 0 ) {
            hash = target_details[i].id;
          }
          else {
            hash = target_details[i-1].id;
          }
          break;
        }
      }

      // generate iframes when these are entering the viewport
      checkIframes();

      Guides.Functions.setNavActive( $('a[href="#' + hash + '"]', container).get(0) );
      Guides.Functions.updateTitle( Guides.Helpers.getElement(), firstLoad);

      if (!firstLoad) {
        Guides.Functions.updateUrl(hash);
      } else {
       firstLoad = false;
      }
    }
  }

  function checkIframes() {
    var scrollPos = window.scrollY || window.pageYOffset;

    if(target_iframe.length) {
      for ( var i = 0; i < target_iframe.length; i++ ) {
        if ( target_iframe[i].top <= (scrollPos + window.innerHeight + 100) &&
             target_iframe[i].top > (scrollPos - window.innerHeight + 100) &&
             target_iframe[i].activated === false
          ) {
          target_iframe[i].activated = true;
          var iframe = iframe_placeholder.eq(i).find('.result-placeholder');
          if(iframe.length) Guides.Functions.setIframes(iframe.get(0));
          break;
        }
      }
    }
  }

  function stopSpying () {
    spying = false;
  }

  function startSpying () {
    spying = true;

    checkIframes();
  }

  // listen for updates
  $(document).on('scrolled', update);
  $(document).on('resized', gather);
  $(document).on('stopspying', stopSpying);
  $(document).on('startspying', startSpying);


  // init
  $(window).on('load', gather);
  init();
};
