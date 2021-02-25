import React, { Component } from "react";
import $ from "jquery";
import "./stickyList.css";

class StickyListSection extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params !== nextProps.match.params) {
    }
  }

  render() {
    const { header, content } = this.props;

    return (
      <div className="sticky-list__section">
        <div className="sticky-list__section__header">{header}</div>
        <div className="sticky-list__section__content">{content}</div>
      </div>
    );
  }
}

export default class StickyList extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params !== nextProps.match.params) {
    }
  }

  componentDidMount() {
    var stickyHeaders = (function () {
      var $window = $(window),
        $stickies;

      var load = function (stickies) {
        if (typeof stickies === "object" && stickies.length > 0) {
          $stickies = stickies.each(function () {
            var $thisSticky = $(this).wrap(
              '<div class="sticky-list__section__header-wrap" />'
            );

            $thisSticky
              .data("originalPosition", $thisSticky.offset().top)
              .data("originalHeight", $thisSticky.outerHeight())
              .parent()
              .height($thisSticky.outerHeight());
          });

          $window.off("scroll.stickies").on("scroll.stickies", function () {
            _whenScrolling();
          });
        }
      };

      var _whenScrolling = function () {
        $stickies.each(function (i) {
          var $thisSticky = $(this),
            $stickyPosition = $thisSticky.data("originalPosition"),
            $stickyHeight = $thisSticky.data("originalHeight"),
            $stickyParentHeight = $thisSticky
              .parents(".sticky-list__section")
              .outerHeight();

          if ($stickyPosition <= $window.scrollTop()) {
            //  Handle scrolling down the page
            // when original position of sticky moves above the window, make sticky fixed position
            var $nextSticky = $stickies.eq(i + 1),
              $nextStickyPosition =
                $nextSticky.data("originalPosition") - $stickyHeight;

            $thisSticky.addClass("fixed");

            if ($stickyPosition + $stickyParentHeight <= $window.scrollTop()) {
              // when bottom of sticky section moves above the window, make sticky absolute position above the next sticky
              $thisSticky.addClass("absolute").css("top", $nextStickyPosition);
            } else {
              // when the bottom of the sticky section moves into the window, remove absolute position
              // this prevents the last sticky in a list from remaining in the window
              $thisSticky.removeClass("absolute");
            }
          } else {
            // Handle scrolling up the page
            // when original position of sticky moves into the window, remove fixed position
            var $prevSticky = $stickies.eq(i - 1);

            $thisSticky.removeClass("fixed");

            if (
              $prevSticky.length > 0 &&
              $window.scrollTop() <= $stickyPosition - $stickyHeight
            ) {
              // when bottom of sticky moves into window, remove absolute position
              console.log("removing absolute!");
              $prevSticky.removeClass("absolute").removeAttr("style");
            }
          }
        });
      };

      return {
        load: load,
      };
    })();

    $(function () {
      stickyHeaders.load($(".sticky-list__section__header"));
    });
  }

  render() {
    const { heroImage, title, sections } = this.props;
    return (
      <div className="sticky-list">
        <div className="sticky-list__hero">
          <img className="sticky-list__hero__image" src={heroImage} />
          <h2 className="sticky-list__hero__title">{title}</h2>
        </div>
        {sections.map((section) => (
          <StickyListSection
            header={section.header}
            content={section.content}
          />
        ))}
      </div>
    );
  }
}
