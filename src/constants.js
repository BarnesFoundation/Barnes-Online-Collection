// objects
export const SET_OBJECTS = 'SET_OBJECTS';
export const APPEND_OBJECTS = 'APPEND_OBJECTS';

// relatedObjects
export const SET_RELATED_OBJECTS = 'SET_RELATED_OBJECTS';
export const CLEAR_RELATED_OBJECTS = 'CLEAR_RELATED_OBJECTS';

// ensembleObjects
export const SET_ENSEMBLE_OBJECTS = 'SET_ENSEMBLE_OBJECTS';

// object
export const SET_OBJECT = 'SET_OBJECT';
export const CLEAR_OBJECT = 'CLEAR_OBJECT';

// filterSets
export const SELECT_FILTER_SET = 'SELECT_FILTER_SET';
export const CLOSE_FILTER_SET = 'CLOSE_FILTER_SET';

// mobileFilters
export const OPEN_MOBILE_FILTERS = 'OPEN_MOBILE_FILTERS';
export const CLOSE_MOBILE_FILTERS = 'CLOSE_MOBILE_FILTERS';
export const QUEUE_MOBILE_FILTERS = 'QUEUE_MOBILE_FILTERS';
export const APPLY_MOBILE_FILTERS = 'APPLY_MOBILE_FILTERS';
export const RESET_MOBILE_FILTERS = 'RESET_MOBILE_FILTERS';

// filters
export const ADD_FILTER = 'ADD_FILTER';
export const SHUFFLE_FILTERS = 'SHUFFLE_FILTERS';
export const REMOVE_FILTER = 'REMOVE_FILTER';
export const REMOVE_FILTER_BY_INDEX = 'REMOVE_FILTER_BY_INDEX';
export const REMOVE_FILTER_BY_SLUG = 'REMOVE_FILTER_BY_SLUG';
export const CLEAR_ALL_FILTERS = 'CLEAR_ALL_FILTERS';

// search
export const ADD_SEARCH_TERM = 'ADD_SEARCH_TERM';
export const CLEAR_SEARCH_TERM = 'CLEAR_SEARCH_TERM';

// objectsQuery
export const OBJECTS_QUERY_SET_IS_PENDING = 'OBJECTS_QUERY_SET_IS_PENDING';
export const OBJECTS_QUERY_SET_HAS_MORE_RESULTS = 'OBJECTS_QUERY_SET_HAS_MORE_RESULTS';
export const OBJECTS_QUERY_SET_LAST_INDEX = 'OBJECTS_QUERY_SET_LAST_INDEX';

// ensembleObjectsQuery
export const ENSEMBLE_OBJECTS_QUERY_SET_IS_PENDING = 'ENSEMBLE_OBJECTS_QUERY_SET_IS_PENDING';

// relatedObjectsQuery
export const RELATED_OBJECTS_QUERY_SET_IS_PENDING = 'RELATED_OBJECTS_QUERY_SET_IS_PENDING';

// prints
export const SET_PRINTS = 'SET_PRINTS';

// htmlClassManager
export const HTML_CLASSES_RESET = 'HTML_CLASSES_RESET';
export const HTML_CLASSES_ADD = 'HTML_CLASSES_ADD';
export const HTML_CLASSES_TOGGLE = 'HTML_CLASSES_TOGGLE';
export const HTML_CLASSES_REMOVE = 'HTML_CLASSES_REMOVE';
// this should match the class used by the styleguide
export const CLASSNAME_NAV_ACTIVE = 'nav-active';
export const CLASSNAME_MODAL_OPEN = 'modal-open';

// ui
export const MODAL_SHOW = 'MODAL_SHOW';
export const MODAL_HIDE = 'MODAL_HIDE';
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
