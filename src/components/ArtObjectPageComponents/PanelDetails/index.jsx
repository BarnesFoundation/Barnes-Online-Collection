import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SummaryTable from './SummaryTable';
import AccordionMenu from '../../AccordionMenu';
import Zoom from '../../Zoom/Zoom';
import Icon from '../../Icon';
import * as ObjectActions from '../../../actions/object';
import * as PrintActions from '../../../actions/prints';
import { getObjectCopyright } from '../../../copyrightMap';
import { sharePlatforms, createShareForPlatform } from '../../../shareModule';
import './index.css';

// use JSON.parse to parse string "true" or "false"
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

// TODO => Convert this to class if smaller images end up being available on object level.
const Image = ({
  isZoomed,
  onLoad,
  setRef,
  isLoaded,
  object,
  width,
  activeImageIndex,
  setActiveImageIndex
}) => {
  let className = 'art-object__image';
  let additionalStyle = {};
  if (isZoomed) {
    className = `${className} art-object__image-hidden`;
    additionalStyle = { ...additionalStyle, display: 'none' };
  };

  const actualWidth = width || '100%';

  return (
    <div className='art-object__header m-block'>
      <div className='image-art-object'>
        {isZoomed && <Zoom id={object.id} />}
        <img
          aria-hidden="true"
          className=""
          src={object.imageUrlLarge}
          alt={object.title}
          onLoad={onLoad}
          ref={setRef}
          style={{ ...additionalStyle }}
        />
        {(isLoaded) && <button
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
      {Boolean((isLoaded && width) || isZoomed) &&
        <div className='image-caption'>
          <div
            className='font-smallprint color-medium image-caption__content'
            style={{ width: actualWidth }}
          >
            {object.people}. {object.title}, {object.displayDate}. {object.invno}. {object.creditLine}
          </div>
          <div
            className='image-caption__grid'
            style={{ width: actualWidth }}
          >
            {/* TODO => Replace this with real images. */}
            {[...Array(STATIC_IMAGE_COUNT)].map((x, i) => {
              let className = 'image-caption__grid-image';
              if (activeImageIndex === i) className = `${className} image-caption__grid-image--active`;

              return (
                <div
                  onClick={() => setActiveImageIndex(i)}
                  className={className}
                  key={i}
                >
                  <img src={object.imageUrlSmall} />
                  <div className='image-caption__inner-border'></div>
                </div>
              )
            })}
          </div>
        </div>}
    </div>
  );
};

class PanelDetails extends Component {
  constructor(props) {
    super(props);
    
    this.ref = null;
    this.state = {
      imageLoaded: false,
	  activeImageIndex: 0,
	  showShareDialog: false
    };
  }

  /** Update state infomration. */
  onLoad = () => this.setState({ imageLoaded: true });
  setActiveImageIndex = index => this.setState({ activeImageIndex: index < 0 ? STATIC_IMAGE_COUNT - 1 : index % STATIC_IMAGE_COUNT }); 
  toggleShareDialog = () => this.setState({ showShareDialog: !this.state.showShareDialog });

  onShareLinkClick = (platform) => {
  	const { id, people, title } = this.props.object;
	const shareLink = createShareForPlatform(people, title, id, platform, this.props.object.imageUrlLarge);
	console.log(shareLink);
	window.open(shareLink, '_blank');
  };

  /** Ref to determine width of caption and images. */
  setRef = ref => this.ref = ref;

  render() {
    const { object, prints } = this.props;
    const { imageLoaded, activeImageIndex, showShareDialog } = this.state;

    const printAvailable = prints.find(({ id }) => id === object.invno);

    const objectCopyrightDetails = getObjectCopyright(object);
    const accordionTabList = getTabList(object);

    const requestImageUrl = `https://barnesfoundation.wufoo.com/forms/barnes-foundation-image-request/def/field22=${object.people}&field21=${object.title}&field20=${object.invno}`;
    const downloadRequestUrl = `https://barnesfoundation.wufoo.com/forms/barnes-foundation-image-use-information/def/field22=${object.people}&field372=${object.title}&field20=${object.invno}&field374=${object.imageUrlForWufoo}`;

    return (
      <div className="art-object-page__panel-details">
        <Image
          onLoad={this.onLoad}
          isLoaded={imageLoaded}
          setRef={this.setRef}
          width={this.ref ? this.ref.width : 0}
          object={object}
          isZoomed={Boolean(objectCopyrightDetails.type === 'large' && isZoomEnabled)}
          activeImageIndex={activeImageIndex}
          setActiveImageIndex={this.setActiveImageIndex}
        />
        <div className="art-object__more-info m-block m-block--shallow">
          <div className="container-inner-narrow">
            <SummaryTable {...object} objectCopyrightDetails={objectCopyrightDetails}/>

            {/* Removed rel="noopener noreferrer nofollow" from the following links. */}
            <div className="m-block m-block--no-border m-block--shallow m-block--flush-top">
              {objectCopyrightDetails.type === "large"
              ?
                <a className="btn btn--primary" href={downloadRequestUrl} target="_blank" >
                  Download Image
                </a>
              :
                <a className="btn btn--primary" href={requestImageUrl} target="_blank" >
                  Request Image
                </a>}

              {printAvailable &&
                <a className="btn" href={printAvailable.url} target="_blank" >
                  Purchase Print
                </a>}

			<div className="share">
				{showShareDialog && 
					<div className="share-dialog">
						<a className="share-dialog__link" onClick={() => { this.onShareLinkClick(sharePlatforms.FACEBOOK)}}>Facebook</a>
						<a className="share-dialog__link" onClick={() => { this.onShareLinkClick(sharePlatforms.TWITTER)}}>Twitter</a>
						<a className="share-dialog__link" onClick={() => { this.onShareLinkClick(sharePlatforms.PINTEREST)}}>Pinterest</a>
						<a className="share-dialog__link" onClick={() => { this.onShareLinkClick(sharePlatforms.EMAIL)}}>Email</a>
						<a className="share-dialog__link" onClick={() => { this.onShareLinkClick(sharePlatforms.COPY_URL)}}>Copy Link</a>
					</div>
				}
				<div className='share-button'>
					<div className='share-button__content'>
					<div className='share-button__icon' >
						<Icon svgId='-icon_share' classes='share-button__svg'/>
					</div>
					<span className='font-simple-heading share-button__text' onBlur={() => { this.toggleShareDialog(); }} onClick={() => { this.toggleShareDialog(); }}>Share It</span>
					</div>
				</div>
				</div>
			</div>

            {object.shortDescription &&
              <div className="art-object__more-info m-block m-block--shallow">
                <div className="art-object__short-description" dangerouslySetInnerHTML={{ __html: object.shortDescription }}>
				        </div>
              </div>}

            {Boolean(accordionTabList) && <AccordionMenu tabList={accordionTabList} />}
          </div>
        </div>
      </div>
    );
  }
};


function mapStateToProps(state) {
  return {
    object: state.object,
    prints: state.prints,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, ObjectActions, PrintActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PanelDetails);
