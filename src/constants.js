// objects
export const SET_OBJECTS = 'SET_OBJECTS';
export const APPEND_OBJECTS = 'APPEND_OBJECTS';

//object
export const SET_OBJECT = 'SET_OBJECT';

//filterSets
export const SELECT_FILTER_SET = 'SELECT_FILTER_SET';
export const CLOSE_FILTER_SET = 'CLOSE_FILTER_SET';

//mobileFilters
export const OPEN_MOBILE_FILTERS = 'OPEN_MOBILE_FILTERS';
export const CLOSE_MOBILE_FILTERS = 'CLOSE_MOBILE_FILTERS';

//filters
export const ADD_FILTER = 'ADD_FILTER';
export const SHUFFLE_FILTERS = 'SHUFFLE_FILTERS';
export const REMOVE_FILTER = 'REMOVE_FILTER';
export const REMOVE_FILTER_BY_INDEX = 'REMOVE_FILTER_BY_INDEX';
export const REMOVE_FILTER_BY_SLUG = 'REMOVE_FILTER_BY_SLUG';
export const CLEAR_ALL_FILTERS = 'CLEAR_ALL_FILTERS';

//search
export const ADD_SEARCH_TERM = 'ADD_SEARCH_TERM';
export const CLEAR_SEARCH_TERM = 'CLEAR_SEARCH_TERM';

//hitsDisplayed
export const SET_LAST_INDEX = 'SET_LAST_INDEX';
export const SET_MAX_HITS = 'SET_MAX_HITS';

//prints
export const SET_PRINTS = 'SET_PRINTS';

//htmlClassManager
export const HTML_CLASSES_RESET = 'HTML_CLASSES_RESET';
export const HTML_CLASSES_ADD = 'HTML_CLASSES_ADD';
export const HTML_CLASSES_TOGGLE = 'HTML_CLASSES_TOGGLE';
export const HTML_CLASSES_REMOVE = 'HTML_CLASSES_REMOVE';

//ui
export const SHOW_ZOOM_OVERLAY = 'SHOW_ZOOM_OVERLAY';
export const HIDE_ZOOM_OVERLAY = 'HIDE_ZOOM_OVERLAY';
export const RESET_UI = 'RESET_UI';

// urls
export const MAIN_WEBSITE_DOMAIN = '//www.barnesfoundation.org';
export const CANONICAL_ROOT = process.env.REACT_APP_CANONICAL_ROOT || 'https://collection.barnesfoundation.org';

// meta tag content
export const META_TITLE = 'Barnes Collection Online';
export const META_IMAGE = CANONICAL_ROOT + '/barnes-logo.svg';
export const META_DESCRIPTION = 'The Barnes Foundation in Philadelphia is home to one of the world\'s greatest collections of impressionist, post-impressionist and early modern paintings.';

// breakpoints
export const BREAKPOINTS = {
  desktop_min: 426,
  mobile_max: 425
};

// copyrights
export const COPYRIGHT_MAP = {
  1: {
    copy: 'In Copyright',
    link: 'http://rightsstatements.org/page/InC/1.0/?language=en',
    type: 'small'
  },
  3: {
    copy: 'ARS',
    link: 'http://rightsstatements.org/page/InC/1.0/?language=en',
    type: 'small'
  },
  4: {
    copy: 'Public Domain',
    link: 'https://creativecommons.org/publicdomain/mark/1.0/',
    type: 'large'
  },
  8: {
    copy: 'No Known Rights: Public Domain',
    link: 'https://creativecommons.org/publicdomain/mark/1.0/',
    type: 'large'
  },
  2: {
    copy: 'World Rights: Copyright Undetermined',
    link: 'http://rightsstatements.org/page/UND/1.0/?language=en',
    type: 'small'
  },
  10: {
    copy: 'World Rights: Public Domain',
    link: 'https://creativecommons.org/publicdomain/mark/1.0/',
    type: 'large'
  },
  6: {
    copy: 'No Known Claimant',
    link: 'http://rightsstatements.org/page/UND/1.0/?language=en',
    type: 'small'
  }
};
