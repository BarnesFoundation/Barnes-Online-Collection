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
import { sharePlatforms, createShareForPlatform } from '../../../shareModule';
import './index.css';

// use JSON.parse to parse string 'true' or 'false'
const isZoomEnabled = process.env.REACT_APP_FEATURE_ZOOMABLE_IMAGE && JSON.parse(process.env.REACT_APP_FEATURE_ZOOMABLE_IMAGE);

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

class Thumbnails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    }
  }

  toggleOpenStatus = () => {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
  }

  render() {
    const { activeImageIndex, setActiveImageIndex, object } = this.props;
    const { isOpen } = this.state;

    // TODO => This will eventually be dynamic data.
    const images = [...Array(STATIC_IMAGE_COUNT)].map((_x, i) => {
      // Set up classNames, if selected add BEM modifier.
      let gridImageClassName = 'masonry-grid-element thumbnails__grid-image';
      let gridListElClassName = 'grid-list-el';

      if (activeImageIndex === i) {
        gridImageClassName = `${gridImageClassName} thumbnails__grid-image--active`;

        // Uncomment this to keep caption open onClick.
        // gridListElClassName = `${gridListElClassName} grid-list-el--active`;
      }

      return (
        <li
          onClick={() => setActiveImageIndex(i)}
          className={gridImageClassName}
          key={i}
        >
          <div className={gridListElClassName}>
            <div className='art-object-fade__in'>
              <div className='thumbnails__thumbnail-wrapper'>
                <img className='thumbnails__thumbnail' src={object.imageUrlSmall} />
              </div>
              <div className='thumbnails__inner-border'></div>
            </div>
            <ArtObjectOverlay
              isThumbnail
              people={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore'}
            />
          </div>
        </li>
      )
    });

    const defaultImages = images.slice(0, 5);
    const hiddenImages = images.slice(5);

    // Unless view more has been clicked, hide past 5.
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
            onClick={this.toggleOpenStatus}
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
  }
}

/** Image component with caption. */
class Image extends Component {
  constructor(props) {
    super(props);

    this.ref = null;
  }

  render() {
    const {
      isZoomed,
      onLoad,
      isLoaded,
      object,
      activeImageIndex,
      setActiveImageIndex
    } = this.props;
    
    let className = 'art-object__image';
    let additionalStyle = {};
    if (isZoomed) {
      className = `${className} art-object__image-hidden`;
      additionalStyle = { ...additionalStyle, display: 'none' };
    };

    return (
      <div>
        <div className='image-art-object'>
          {isZoomed && <Zoom id={object.id} />}
          <img
            aria-hidden='true'
            className=''
            src={object.imageUrlLarge}
            alt={object.title}
            onLoad={onLoad}
            style={{ ...additionalStyle }}
            ref={ref => this.ref = ref}
          />
          {isLoaded && <button
            className='btn image-art-object__arrow-button image-art-object__arrow-button--left'
            onClick={() => setActiveImageIndex(activeImageIndex - 1)}
          >
            <Icon classes='image-art-object__arrow' svgId='-caret-left'/>
          </button>}
          {isLoaded && <button
            className='btn image-art-object__arrow-button image-art-object__arrow-button--right'
            onClick={() => setActiveImageIndex(activeImageIndex + 1)}
          >
            <Icon classes='image-art-object__arrow' svgId='-caret-right'/>
          </button>}
        </div>
        <div className='image-caption'>
          <div
            className='font-smallprint color-medium image-caption__content'
            style={{ width: this.ref ? this.ref.width : 'auto' }}
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
	  showShareDialog: false,
	  copyText: ''
    };
  }

  /** Update state infomration. */
  onLoad = () => this.setState({ imageLoaded: true });
  setActiveImageIndex = index => this.setState({ activeImageIndex: index < 0 ? STATIC_IMAGE_COUNT - 1 : index % STATIC_IMAGE_COUNT }); 
  toggleShareDialog = () => this.setState({ showShareDialog: !this.state.showShareDialog });

  onShareLinkClick = (platform) => {

	const { id, people, title } = this.props.object;
	const shareLink = createShareForPlatform(people, title, id, platform, this.props.object.imageUrlLarge);

	if (platform === sharePlatforms.COPY_URL) {
		this.setState({ copyText: shareLink },
			() => {
				this.copy.select();
				console.log(this.copy);
				document.execCommand('copy');
			});
	}
	
	else window.open(shareLink, '_blank');
  };

  render() {
    const { object, prints } = this.props;
    const { imageLoaded, activeImageIndex, showShareDialog, copyText } = this.state;

    const printAvailable = prints.find(({ id }) => id === object.invno);

    const objectCopyrightDetails = getObjectCopyright(object);
    const accordionTabList = getTabList(object);

    const requestImageUrl = `https://barnesfoundation.wufoo.com/forms/barnes-foundation-image-request/def/field22=${object.people}&field21=${object.title}&field20=${object.invno}`;
    const downloadRequestUrl = `https://barnesfoundation.wufoo.com/forms/barnes-foundation-image-use-information/def/field22=${object.people}&field372=${object.title}&field20=${object.invno}&field374=${object.imageUrlForWufoo}`;

    const isZoomed = Boolean(objectCopyrightDetails.type === 'large' && isZoomEnabled);

    return (
      <div className='art-object-page__panel-details'>
        <div className='art-object__header m-block'>
          <Image
            onLoad={this.onLoad}
            isLoaded={imageLoaded}
            object={object}
            isZoomed={isZoomed}
            activeImageIndex={activeImageIndex}
            setActiveImageIndex={this.setActiveImageIndex}
          />
          {Boolean(imageLoaded || isZoomed) &&
            <Thumbnails
              activeImageIndex={activeImageIndex}
              setActiveImageIndex={this.setActiveImageIndex}
              object={object}
            />
          }
        </div>
        <div className='art-object__more-info m-block m-block--shallow'>
          <div className='container-inner-narrow'>
            <SummaryTable {...object} objectCopyrightDetails={objectCopyrightDetails} />
            <div className='m-block m-block--no-border m-block--shallow m-block--flush-top download-and-share'>
              {/* Removed rel='noopener noreferrer nofollow' from the following links. */}
              <a
                className='btn btn--primary'
                href={objectCopyrightDetails.type === 'large' ? downloadRequestUrl : requestImageUrl}
                target='_blank' >
                {objectCopyrightDetails.type === 'large' ? 'Download Image' : 'Request Image'}
              </a>
              {printAvailable &&
                <a className='btn' href={printAvailable.url} target='_blank' >
                  Purchase Print
                </a>}

              {/* We may want to make this a separate component that can just be dropped in -- since it's being used in at least 2 places */}
              <div className="share">
                {showShareDialog &&
                  <div className="share-dialog">
                    <a className="share-dialog__link" onClick={() => { this.onShareLinkClick(sharePlatforms.FACEBOOK) }}>Facebook</a>
                    <a className="share-dialog__link" onClick={() => { this.onShareLinkClick(sharePlatforms.TWITTER) }}>Twitter</a>
                    <a className="share-dialog__link" onClick={() => { this.onShareLinkClick(sharePlatforms.PINTEREST) }}>Pinterest</a>
                    <a className="share-dialog__link" onClick={() => { this.onShareLinkClick(sharePlatforms.EMAIL) }}>Email</a>
                    <a className="share-dialog__link" onClick={() => { this.onShareLinkClick(sharePlatforms.COPY_URL) }}>Copy Link</a>
                    <input style={{ position: 'absolute', height: 0, opacity: '.01' }} ref={(area) => this.copy = area} value={copyText} />
                  </div>
                }
                <div className='panel-button panel-button--share'>
                  <div className='panel-button__content'>
                    <div className='panel-button__icon' >
                      <Icon svgId='-icon_share' classes='panel-button__svg' />
                    </div>
                    <span className='font-simple-heading panel-button__text' onBlur={() => { this.toggleShareDialog(); }} onClick={() => { this.toggleShareDialog(); }}>Share It</span>
                  </div>
                </div>
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
