import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router'
import queryString from 'query-string';
import { getAllObjects } from '../../actions/objects';
import { addSearchTerm } from '../../actions/search';
import { setFilters } from '../../actions/filters';
import { closeFilterSet } from '../../actions/filterSets';
import { getMetaTagsFromObject, getQueryKeywordUrl, getQueryFilterUrl} from '../../helpers';
import { SiteHeader } from '../SiteHeader/SiteHeader';
import SiteHtmlHelmetHead from '../SiteHtmlHelmetHead';
import HtmlClassManager from '../HtmlClassManager';
import CollectionFilters from '../CollectionFilters/CollectionFilters';
import ArtObjectGrid from '../ArtObjectGrid/ArtObjectGrid';
import { Footer } from '../Footer/Footer';
import { heroes } from './HeroImages';
import peasants from './images/peasants.jpg'
import './landingPage.css';

/**
 * Header JSX for landing page.
 */
class LandingPageHeader extends Component {
  constructor(props) {
    super(props);

    this.sto = null;
    this.si = null;
    this.textSto = null;
    this.resizeSto = null;

    this.windowWidth = window.innerWidth;

    this.state = {
      imageIndex: 0,
      isInit: false, // If the animation has been triggered at least once.
      imageLoaded: false, // If first image has been loaded.

      styles: { opacity: 1 },
    };
  }

  /** Start running animation. */
  triggerImageTranslation = () => {
    this.setState({
      isInit: true,
      textShowing: true,

      styles: { opacity: 0 },
    });
  }

  /** Set up image interval and text STO inside of interval. */
  setIntervalsAndTimeouts = () => {
    const TEXT_TIMEOUT = 9000;
    const INTERVAL_TIMEOUT = TEXT_TIMEOUT + 2000;

    this.textSto = setTimeout(() => {
      this.setState({ textShowing: false });
    }, TEXT_TIMEOUT);

    // Reset interval.
    this.si = setInterval(() => {
      this.textSto = setTimeout(() => {
        this.setState({ textShowing: false });
      }, TEXT_TIMEOUT);

      this.setState(
        ({ imageIndex }) => ({ imageIndex: (imageIndex + 1) % heroes.length, textShowing: true }),
        () => this.triggerImageTranslation()
      )
    }, INTERVAL_TIMEOUT);
  }

  /**
   * Reset animation state on focus out.
   * Some browsers will stop running JS on focus out, this method and the event emitters it is tied to will prevent animations from
   * becoming out of phase with out setInterval.
   * */
  handleVisibilityChange = () => {
    const { imageIndex } = this.state;

    if (document.visibilityState === 'visible') {
      // This will effectively reset the image montage with the next index on re-viewing a page.
      this.setState(
        {
          styles: { opacity: 1, transition: 'none' },
          isInit: false,
          imageIndex: (imageIndex + 1) % heroes.length,
        },
        () => setTimeout(() => this.triggerImageTranslation(), 100)
      );

      this.setIntervalsAndTimeouts();

    } else {
      if (this.sto) clearTimeout(this.sto);
      if (this.si) clearInterval(this.si);
      if (this.textSto) clearTimeout(this.textSto);
    }
  }

  /**
   * On resize, prevent any further animation.
   */
  resizeChange = () => {
    if (this.resizeSto) {
      clearTimeout(this.resizeSto);
    }
    

    this.resizeSto = setTimeout(() => {
      // Only trigger if width is different.
      // This is to prevent triggering on iOS every time there is a scroll.
      if (window.innerWidth !== this.windowWidth) {
        if (this.sto) clearTimeout(this.sto);
        if (this.si) clearInterval(this.si);
        if (this.textSto) clearTimeout(this.textSto);

        this.windowWidth = window.innerWidth;
        this.handleVisibilityChange();
      }
    }, 500);
  }

  // Set up event listeners and intervals..
  componentDidMount() {
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    document.addEventListener('onpageshow', this.handleVisibilityChange);
    window.addEventListener('resize', this.resizeChange());


    // Trigger is init after mount, this will cause animation to play.
    this.sto = setTimeout(() => {
      this.triggerImageTranslation();
    }, 100);

    this.setIntervalsAndTimeouts();
  }

  // Cleanup event listener, sto, and interval on unmount.
  componentWillUnmount() {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    document.removeEventListener('onpageshow', this.handleVisibilityChange);
    window.removeEventListener('resize', this.resizeChange);

    if (this.sto) clearTimeout(this.sto);
    if (this.si) clearTimeout(this.si);
    if (this.textSto) clearTimeout(this.textSto);
    if (this.resizeSto) clearTimeout(this.resizeSto)
  }

  render() {
    const { styles, imageIndex, isInit, textShowing, imageLoaded } = this.state;

    return (
      <div className='o-hero o-hero--landing-page'>
        <div className='o-hero__inner'>
          <div className='o-hero__overlay'></div>
          <div className='container o-hero__container'>
            <div className='o-hero__copy'>
              {heroes.map(({ text }, index) => {
                const isActiveImage = index === imageIndex;

                let supportingClassNames = 'o-hero__supporting';
                if (!isActiveImage || !textShowing) supportingClassNames = `${supportingClassNames} o-hero__supporting--hidden`;

                return <p key={text} className={supportingClassNames}>{text}</p>;
              })}
            </div>
          </div>
        </div>
        <div className='o-hero__image-wrapper'>
          {/** Serve small image until first image is loaded */}
          <img
            className={`o-hero__image o-hero__image--lazy o-hero__image--0--${isInit ? 'active' : 'start'}`}
            src={peasants}
            style={{
              display: imageLoaded ? 'none' : 'block'
            }}
          />
          {heroes.map(({ srcName }, index) => {
            const isActiveImage = index === imageIndex;
            const src = `https://barnesfoundation-collection.imgix.net/collection-storyboard-images/${srcName}.jpg`;

            let imageClassName = `o-hero__image o-hero__image--${index}`;
            let style = isActiveImage
              ? { ...styles }
              : { opacity: isInit ? 1 : 0 };

            // Make sure next image appears beneath active image.
            if (isActiveImage && isInit) {
              imageClassName = `${imageClassName} o-hero__image--active o-hero__image--${index}--active`;
            } else if ((index === (imageIndex + 1) % heroes.length) || (isActiveImage && !isInit)) {
              imageClassName = `${imageClassName} o-hero__image--start o-hero__image--${index}--start`;
            }

            return (
              <img
                key={index}
                className={imageClassName}
                src={src}
                style={{ ...style }}
                alt='Barnes Museum Ensemble.'
                onLoad={() => {
                  if (index === 0) {
                    setTimeout(() => this.setState({ imageLoaded: true }), 2000);
                  }
                }}
              />
            );
          })}
        </div>
      </div>
    )
  }
}

class LandingPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      resetTruncateThreshold: null,
    };
  }

  /**
   * Parse JSON from querystring and set up search, filters, and advanced filters.
   */
  componentDidMount() {
    const { qtype, qval, } = queryString.parse(this.props.location.search); // Destructure querystring.

    // If there is a querystring, run filtered search.
    if (qval && qval.length) {
      // For filters
      if (qtype === 'filter') {
        let filterSelection = {};
  
        try {
          filterSelection = JSON.parse(qval);
        } catch (e) {
          console.error('Invalid JSON in filter.');
        }
  
        this.props.setFilters(filterSelection);

      // For search
      } else if (qtype === 'keyword') {
        this.props.addSearchTerm(qval);
      }
    } else {
      // Otherwise, get all objects.
      this.props.getAllObjects();
    }
  }

  /**
   * On props update.
   * TODO => This is convoluted and fires on either search, filters, or history changing.  Rewrite this in a more declarative way.
   */
  componentDidUpdate(prevProps) {
    const {
      search,
      filters,
      history: { location: { state: newState }}, // For detecting if a modal is open.
      modalIsOpen,
    } = this.props;
    const { resetTruncateThreshold } = this.state;

    // Detect if we just opened a modal. If so, just return.
    if (newState && newState.isModal) return;
    if (
      JSON.stringify(prevProps.filters) === JSON.stringify(filters)
      && prevProps.isModal === modalIsOpen
    ) {
      return;
    }

    if (resetTruncateThreshold) resetTruncateThreshold();

    const { qtype: queryType, qval: queryVal } = queryString.parse(this.props.location.search);

    if (search.length) {
      if (search !== queryVal) this.props.history.push(getQueryKeywordUrl(search));
    } else if (
      (filters.ordered && filters.ordered.length) // If there are ordered filters
      || Object.values(filters.advancedFilters).reduce((acc, advancedFilter) => acc + Object.keys(advancedFilter).length, 0) // Or advanced filters.
      ) {

      // Reduce and stringify filter state to compare with queryVal.
      const filtersVal = JSON.stringify({
        // Convert ordered array into object for higher ordered filters.
        ...filters.ordered.reduce((acc, filter) => ({
          ...acc, [filter.filterType]: filter.value || filter.name, // For lines and colors we just use the name and for space and light we use the value.
        }), {}),

        // Stringify advanced filters
        advancedFilters: filters.advancedFilters,
      });

      if (filtersVal !== queryVal) {
        this.props.history.push(getQueryFilterUrl(filtersVal));
      }
    } else if (queryType) {
      // Else if there is querytype but no filters or search, reset URL to /.
      this.props.history.push('');
    }
  }

  render() {
    const { object, objectsQuery, objects: liveObjects } = this.props;
    const metaTags = getMetaTagsFromObject(object);
    const isSearchPending = Boolean(objectsQuery && objectsQuery.isPending);
    const pageType = 'landing';

    // If filters are active, apply 50% opacity on search results.
    // let isBackgroundActiveClasses = 'shaded-background__tint';
    // if (isFilterActive) isBackgroundActiveClasses = `${isBackgroundActiveClasses} shaded-background__tint--active`

    return (
      <div className='app app-landing-page'>
        <SiteHtmlHelmetHead metaTags={metaTags} />
        <HtmlClassManager />
        <SiteHeader />

        <div className='landing-page'>
          {/* Prevent FOUC on mount. */}
          <div style={{ minHeight: '100vh' }}>
            <LandingPageHeader />

            <div className='m-block m-block--shallow m-block--no-border m-block--flush-top collection-filters-wrap'>
              <CollectionFilters />
            </div>
            <div className='shaded-background'>
              {/** Shaded background. */}
              {/* <div
                className={isBackgroundActiveClasses}
                onClick={() => {
                  // TODO => Change this to include mobile filters.
                  closeFilterSet()
                }}>  
              </div> */}
              <div className='container'>
                <ArtObjectGrid
                  gridStyle='full-size'
                  shouldLinksUseModal
                  modalPreviousLocation='/'
                  isSearchPending={isSearchPending}
                  liveObjects={liveObjects}
                  pageType={pageType}
                  hasMoreResults
                  setResetTruncateThreshold={resetTruncateThreshold => this.setState({ resetTruncateThreshold })}
                />
              </div>
              <Footer hasHours/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    modalIsOpen: state.modal.modalIsOpen,
    modal: state.modal,
    filters: state.filters,
    search: state.search,

    object: state.object,
    objects: state.objects,
    objectsQuery: state.objectsQuery,
    isFilterActive: Boolean(state.filterSets.visibleFilterSet),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign(
    {},
    {
      //Objects
      getAllObjects, 
      // Search
      addSearchTerm,
      // Filters
      setFilters,
      // FilterSet
      closeFilterSet
    },
  ), dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LandingPage));
