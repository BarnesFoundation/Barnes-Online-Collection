import React, { Component } from "react";
import classnames from "classnames";
import $ from "jquery";
import { getObjectMetaDataHtml } from "../ArtObjectPageComponents/PanelVisuallyRelated";
import { formatTourData } from "../TourPage/tourPageHelper";
import { parseObject } from "../../objectDataUtils";
import "./stickyList.css";

class ObjectCard extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.state = { descriptionVisible: false, metaDataVisible: true };
  }

  handleClick(event) {
    if (this.props.object.shortDescription) {
      const showDescription = !this.state.descriptionVisible;
      let showMetaData = true;

      const $el = $(event.target);
      const $descriptionHeight = $el.find(".overlay-text").outerHeight(true);
      const $imageHeight = $el
        .parents(".sticky-list__section__content__image-card")
        .find(".art-object__image")
        .outerHeight();

      if ($descriptionHeight > $imageHeight && showDescription) {
        showMetaData = false;
      }

      this.setState({
        descriptionVisible: showDescription,
        metaDataVisible: showMetaData,
      });
    }
  }

  render() {
    const { object } = this.props;
    return (
      <div
        className={classnames("sticky-list__section__content__image-card", {
          description: this.state.descriptionVisible,
        })}
        onClick={this.handleClick}
      >
        <div className="art-object__image-container">
          <img
            className="art-object__image"
            src={object.imageUrlLarge}
            alt={object.title}
          />
          <div
            className={classnames("art-object__image-information", {
              invisible: !this.state.metaDataVisible,
            })}
          >
            {getObjectMetaDataHtml(object)}
          </div>
        </div>
        {object.shortDescription ? (
          <div className="overlay">
            <div className="overlay-background">
              <div
                className="overlay-text"
                dangerouslySetInnerHTML={{ __html: object.shortDescription }}
              ></div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

class StickyListSection extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="sticky-list__section">
        <div className="sticky-list__section__header">{this.props.header}</div>
        <div className="sticky-list__section__content">
          {this.props.section.content.map((obj) => {
            return <ObjectCard object={parseObject(obj)} key={obj.id} />;
          })}
        </div>
      </div>
    );
  }
}

export default class StickyList extends Component {
  constructor(props) {
    super(props);
    this.getHeroImage = this.getHeroImage.bind(this);
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

  getHeroImage() {
    const object = this.props.objects.find(
      (obj) => parseInt(obj._id) === this.props.heroImageId
    );
    return parseObject(object._source).imageUrlLarge;
  }

  render() {
    const { title, description, objects, sectionOrder } = this.props;

    return (
      <div className="sticky-list">
        <div className="sticky-list__hero">
          <img className="sticky-list__hero__image" src={this.getHeroImage()} />
          <h2 className="sticky-list__hero__title">{title}</h2>
        </div>
        <p
          className={classnames("sticky-list__description", {
            hidden: !description.length,
          })}
        >
          {description}
        </p>

        {formatTourData(sectionOrder, objects).map((section) => (
          <StickyListSection
            header={section.header}
            key={section.header}
            section={section}
          />
        ))}
      </div>
    );
  }
}
