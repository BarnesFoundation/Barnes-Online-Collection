import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SummaryTable from './SummaryTable';
import AccordionMenu from '../../AccordionMenu';
import ArtObjectOverlay from '../../ArtObject/ArtObjectOverlay';
import Zoom from '../../Zoom/Zoom';
import Icon from '../../Icon';
import * as ObjectActions from '../../../actions/object';
import * as PrintActions from '../../../actions/prints';
import { getObjectCopyright } from '../../../copyrightMap';
import { ShareDialog } from '../../ShareDialog/ShareDialog';
import './index.css';

// use JSON.parse to parse string 'true' or 'false'
const isZoomEnabled = process.env.REACT_APP_FEATURE_ZOOMABLE_IMAGE && JSON.parse(process.env.REACT_APP_FEATURE_ZOOMABLE_IMAGE);

const DEFAULT_THUMBNAIL_COUNT = 5;

const getTabList = (artObjectProps) => (
  [
    {
      title: 'Long Description',
      tabContent: artObjectProps.longDescription,
    },
    {
      title: 'Bibliography',
      tabContent: artObjectProps.bibliography,
    },
    {
      title: 'Exhibition History',
      tabContent: artObjectProps.exhHistory,
    },
    {
      title: 'Provenance',
      tabContent: artObjectProps.publishedProvenance
    },
  ].filter(({ tabContent }) => tabContent) // Filter out tabs with no content.
);

// For modulo
const STATIC_IMAGE_COUNT = 7;

class Thumbnail extends Component {
  constructor(props) {
    super(props);

    this.ref = null;

    this.state = {
      isLandscapeThumbnail: false,
    }
  }

  /** Set image ref to detect if image is portrait. */
  setRef = (ref) => {
    if (!this.ref) {
      this.ref = ref;

      console.log(ref);
      console.log(ref.naturalWidth);
      console.log(ref.naturalHeight);

      if (ref.naturalWidth > ref.naturalHeight) {
        console.log('nice');
        this.setState({ isLandscapeThumbnail: true });
      }
    }
  }

  render() {
    const { isLandscapeThumbnail } = this.state;
    const { onClick, isActive, src, alt } = this.props;
    
    // Set up classNames, if selected add BEM modifier.
    let gridImageClassName = 'masonry-grid-element thumbnails__grid-image';
    let gridListElClassName = 'grid-list-el';
    let thumbnailClassName = 'thumbnails__thumbnail';

    if (isActive) {
      gridImageClassName = `${gridImageClassName} thumbnails__grid-image--active`;

      // Uncomment this to keep caption open onClick.
      // gridListElClassName = `${gridListElClassName} grid-list-el--active`;
    }

    if (isLandscapeThumbnail) thumbnailClassName = `${thumbnailClassName} thumbnails__thumbnail--wide`;

    return (
      <li
        onClick={onClick}
        className={gridImageClassName}
      >
        <div className={gridListElClassName}>
          <div className='art-object-fade__in'>
            <div className='thumbnails__thumbnail-wrapper'>
              <img
                className={thumbnailClassName} src={src} alt={alt}
                ref={this.setRef}
              />
            </div>
            <div className='thumbnails__inner-border'></div>
          </div>
          <ArtObjectOverlay
            isThumbnail
            people={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore'}
          />
        </div>
      </li>
    );
  }
}

const Thumbnails = ({ activeImageIndex, setActiveImageIndex, object, isOpen, toggleOpen }) => {
  const images = [...Array(STATIC_IMAGE_COUNT)].map((_x, i) => (
      <Thumbnail
        key={i}
        onClick={() => setActiveImageIndex(i)}
        isActive={activeImageIndex === i}
        src={object.imageUrlSmall}
        alt={object.title}
      />
    )
  );

  const defaultImages = images.slice(0, DEFAULT_THUMBNAIL_COUNT);
  const hiddenImages = images.slice(DEFAULT_THUMBNAIL_COUNT);

  // Unless view more has been clicked, hide past max.
  let hiddenImagesClassNames = 'thumbnails__hidden-images';
  if (isOpen) hiddenImagesClassNames = `${hiddenImagesClassNames} thumbnails__hidden-images--active`;

  // If panel button is activated, add styling to flip and adjust icon positioning.
  let panelButtonClassNames = 'panel-button';
  if (isOpen) panelButtonClassNames = `${panelButtonClassNames} panel-button--hide`;

  return (
    <div className='thumbnails component-art-object-grid'>
      <div className='thumbnails__grid-wrapper'>
        <ul className='thumbnails__grid'>
          {defaultImages}
        </ul>
      </div>
      <div className={hiddenImagesClassNames}>
        <div className='thumbnails__grid-wrapper'>
          <ul className='thumbnails__grid'>
            {hiddenImages}
          </ul>
        </div>
      </div>
      <div className={panelButtonClassNames}>
        <div
          className='panel-button__content'
          onClick={toggleOpen}
        >
          <div className='panel-button__icon' >
            <Icon svgId='-icon_arrow_down' classes='panel-button__svg'/>
          </div>
          <span className='font-simple-heading panel-button__text'>
            {!isOpen ? 'View More' : 'View Less'}
          </span>
        </div>
      </div>
    </div>
  ); 
};

/** Image component with caption. */
class Image extends Component {
  constructor(props) {
    super(props);

    this.ref = null;

    this.state = { didCatchFailure: false };
  }

  /**
   * Catch exception inside of zoom component.
   * @see Zoom.jsx cDM method.
   */
  catchFailureInViewer = () => {
    this.setState({ didCatchFailure: true });
  }

  render() {
    const {
      onLoad,
      isLoaded,
      object,
      activeImageIndex,
      setActiveImageIndex
    } = this.props;
    const { didCatchFailure } = this.state;
    
    let additionalStyle = {};
    if (!didCatchFailure) {
      additionalStyle = { ...additionalStyle, display: 'none' };
    };

    return (
      <div>
        <div className='image-art-object'>
          {(!didCatchFailure && object.id) &&
            <Zoom
              id={object.id}
              catchFailureInViewer={this.catchFailureInViewer}
            />
          }
          <img
            aria-hidden='true'
            className='image-art-object__img'
            src={object.imageUrlLarge}
            alt={object.title}
            onLoad={onLoad}
            style={{ ...additionalStyle }}
            ref={ref => this.ref = ref}
          />
          {/** Uncomment this once we have thumbnail data. */}
          {isLoaded && <div className='image-art-object__button-group'>
            <button
              className='btn image-art-object__arrow-button image-art-object__arrow-button--left'
              onClick={() => setActiveImageIndex(activeImageIndex - 1)}
            >
              <Icon classes='image-art-object__arrow' svgId='-caret-left'/>
            </button>
            <span className='image-art-object__counter'>{activeImageIndex + 1} / {STATIC_IMAGE_COUNT}</span>
            <button
              className='btn image-art-object__arrow-button image-art-object__arrow-button--right'
              onClick={() => setActiveImageIndex(activeImageIndex + 1)}
            >
              <Icon classes='image-art-object__arrow' svgId='-caret-right'/>
            </button>
          </div>}
        </div>
        <div className='image-caption'>
          <div
            className='font-smallprint color-medium image-caption__content'
            style={{ width: (this.ref && this.ref.width > 100) ? this.ref.width : '100%' }}
          >
            {object.people}. {object.title}, {object.displayDate}. {object.invno}. {object.creditLine}
          </div>
        </div>
      </div>
    );
  }
}

class PanelDetails extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      imageLoaded: false,
      activeImageIndex: 0,
      thumbnailsOpen: false,
    };
  }

  /** On child image loading, update this state. */
  onLoad = () => this.setState({ imageLoaded: true });

  /**
   * Update active index, circling around from 0 -> MAX - 1.
   * If max is > DEFAULT_THUMBNAIL_COUNT, automatically open accordion. 
   */
  setActiveImageIndex = (index) => {
    const nextIndex = index < 0 ? STATIC_IMAGE_COUNT - 1 : index % STATIC_IMAGE_COUNT;

    // Check if next index is greater than DEFAULT_THUMBNAIL_COUNT, set thumbnailsOpen to true.
    if (nextIndex > DEFAULT_THUMBNAIL_COUNT - 1) {
      this.setState({ activeImageIndex: nextIndex, thumbnailsOpen: true });
    } else {
      this.setState({ activeImageIndex: nextIndex });
    }
  }

  /** Toggle thumbnail open status. */
  toggleThumbnailOpenStatus = () => this.setState({ thumbnailsOpen: !this.state.thumbnailsOpen });

  render() {
    const { object, prints } = this.props;
    const { imageLoaded, activeImageIndex, thumbnailsOpen } = this.state;

    const printAvailable = prints.find(({ id }) => id === object.invno);

    const objectCopyrightDetails = getObjectCopyright(object);
    const accordionTabList = getTabList(object);

    const requestImageUrl = `https://barnesfoundation.wufoo.com/forms/barnes-foundation-image-request/def/field22=${object.people}&field21=${object.title}&field20=${object.invno}`;
    const downloadRequestUrl = `https://barnesfoundation.wufoo.com/forms/barnes-foundation-image-use-information/def/field22=${object.people}&field372=${object.title}&field20=${object.invno}&field374=${object.imageUrlForWufoo}`;

    return (
      <div className='art-object-page__panel-details'>
        <div className='art-object__header m-block'>
          <Image
            onLoad={this.onLoad}
            isLoaded={imageLoaded}
            object={object}
            activeImageIndex={activeImageIndex}
            setActiveImageIndex={this.setActiveImageIndex}
          />
          {/** Uncomment this once we have thumbnail data. */}
          {Boolean(imageLoaded) &&
            <Thumbnails
              activeImageIndex={activeImageIndex}
              setActiveImageIndex={this.setActiveImageIndex}
              object={object}
              isOpen={thumbnailsOpen}
              toggleOpen={this.toggleThumbnailOpenStatus}
            />
          }
        </div>
        <div className='art-object__more-info m-block m-block--shallow'>
          <div className='container-inner-narrow'>
            <SummaryTable {...object} objectCopyrightDetails={objectCopyrightDetails} />
            <div className='m-block m-block--no-border m-block--shallow m-block--flush-top download-and-share'>
              {/* Removed rel='noopener noreferrer nofollow' from the following links. */}
              <a
                className='btn btn--primary btn--100'
                href={objectCopyrightDetails.type === 'large' ? downloadRequestUrl : requestImageUrl}
                target='_blank' >
                {objectCopyrightDetails.type === 'large' ? 'Download Image' : 'Request Image'}
              </a>
              {printAvailable &&
                <a className='btn btn--100' href={printAvailable.url} target='_blank' >
                  Purchase Print
                </a>}

              <div className="share share--right">
                <ShareDialog object={object} />
              </div>
            </div>

            {object.shortDescription &&
              <div className='art-object__more-info m-block m-block--shallow'>
                <div className='art-object__short-description' dangerouslySetInnerHTML={{ __html: object.shortDescription }}>
                </div>
              </div>}

            {Boolean(accordionTabList) && <AccordionMenu tabList={accordionTabList} />}
          </div>
        </div>
      </div>
    );
  }
};


const mapStateToProps = state => ({ object: state.object, prints: state.prints });
const mapDispatchToProps = dispatch => bindActionCreators(Object.assign({}, ObjectActions, PrintActions), dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PanelDetails);
