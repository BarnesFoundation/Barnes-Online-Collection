import React, { Component } from 'react';
import $ from 'jquery';
import './stickyList.css'

export default class StickyList extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params !== nextProps.match.params) {
    }
  }

  componentDidMount() {
    var stickyHeaders = (function() {

      var $window = $(window),
          $stickies;
    
      var load = function(stickies) {
    
        if (typeof stickies === "object" && stickies.length > 0) {
          $stickies = stickies.each(function() {
    
            var $thisSticky = $(this).wrap('<div class="sticky-list__section__header-wrap" />');
      
            $thisSticky
                .data('originalPosition', $thisSticky.offset().top)
                .data('originalHeight', $thisSticky.outerHeight())
                  .parent()
                  .height($thisSticky.outerHeight()); 			  
          });
    
          $window.off("scroll.stickies").on("scroll.stickies", function() {
          _whenScrolling();		
          });
        }
      };
    
      var _whenScrolling = function() {
    
        $stickies.each(function(i) {			
    
          var $thisSticky = $(this),
              $stickyPosition = $thisSticky.data('originalPosition'),
              $stickyHeight = $thisSticky.data('originalHeight'),
              $stickyParentHeight = $thisSticky.parents('.sticky-list__section').outerHeight();

          if ($stickyPosition <= $window.scrollTop()) { //  Handle scrolling down the page
            // when original position of sticky moves above the window, make sticky fixed position
            var $nextSticky = $stickies.eq(i + 1),
                $nextStickyPosition = $nextSticky.data('originalPosition') - $stickyHeight;
            
            $thisSticky.addClass("fixed");

            if (($stickyPosition + $stickyParentHeight) <= $window.scrollTop()) {
              // when bottom of sticky section moves above the window, make sticky absolute position above the next sticky
              $thisSticky.addClass("absolute").css("top", $nextStickyPosition);
            } else {
              // when the bottom of the sticky section moves into the window, remove absolute position
              // this prevents the last sticky in a list from remaining in the window
              $thisSticky.removeClass("absolute")
            }
          } else { // Handle scrolling up the page
            // when original position of sticky moves into the window, remove fixed position
            var $prevSticky = $stickies.eq(i - 1);
    
            $thisSticky.removeClass("fixed");
    
            if ($prevSticky.length > 0 && $window.scrollTop() <= $stickyPosition - $stickyHeight) {
              // when bottom of sticky moves into window, remove absolute position
              console.log('removing absolute!')
              $prevSticky.removeClass("absolute").removeAttr("style");
            }
          }
        });
      };
    
      return {
        load: load
      };
    })();
    
    $(function() {
      stickyHeaders.load($(".sticky-list__section__header"));
    });
  }

  render() {
    const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nunc vel risus commodo viverra maecenas accumsan lacus vel. Semper auctor neque vitae tempus quam. Accumsan tortor posuere ac ut consequat semper. Volutpat ac tincidunt vitae semper quis lectus nulla at volutpat. Tortor dignissim convallis aenean et tortor at. Integer enim neque volutpat ac tincidunt vitae semper quis lectus. Tempor id eu nisl nunc. Vel facilisis volutpat est velit egestas dui id ornare arcu. Libero volutpat sed cras ornare.'

    return (
      <div className="sticky-list">
        <div className="tour-page-hero"><img src='https://d2r83x5xt28klo.cloudfront.net/6814_mpfCoboPefnN6Ws6_n.jpg' style={{"width": "100%", "margin-top": "-80px"}} /><h2 className="tour-title">{this.props.title}</h2></div>
        <div className="sticky-list__section">
          <div className="sticky-list__section__header">Room 1</div>
          <div className="sticky-list__section__content">{lorem}</div>
        </div>
        <div className="sticky-list__section">
          <div className="sticky-list__section__header">Room 2</div>
          <div className="sticky-list__section__content">{lorem}</div>
        </div>
        <div className="sticky-list__section">
          <div className="sticky-list__section__header">Room 3</div>
          <div className="sticky-list__section__content">{lorem}</div>
        </div>
        <div className="sticky-list__section">
          <div className="sticky-list__section__header">Room 4</div>
          <div className="sticky-list__section__content">{lorem}</div>
        </div>
        <div className="sticky-list__section">
          <div className="sticky-list__section__header">Room 5</div>
          <div className="sticky-list__section__content">{lorem}</div>
        </div>
        <div className="sticky-list__section">
          <div className="sticky-list__section__header">Room 6</div>
          <div className="sticky-list__section__content">{lorem}</div>
        </div>
      </div>
    );
  }
}
