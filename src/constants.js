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
export const TOGGLE_ARTIST_MENU = 'TOGGLE_ARTIST_MENU';

// mobileFilters
export const OPEN_MOBILE_FILTERS = 'OPEN_MOBILE_FILTERS';
export const CLOSE_MOBILE_FILTERS = 'CLOSE_MOBILE_FILTERS';
export const QUEUE_MOBILE_FILTERS = 'QUEUE_MOBILE_FILTERS';
export const APPLY_MOBILE_FILTERS = 'APPLY_MOBILE_FILTERS';
export const RESET_MOBILE_FILTERS = 'RESET_MOBILE_FILTERS';

// mobileSearch
export const OPEN_MOBILE_SEARCH = 'OPEN_MOBILE_SEARCH';
export const CLOSE_MOBILE_SEARCH = 'CLOSE_MOBILE_SEARCH';

// filters
export const ADD_FILTER = 'ADD_FILTER';
export const SHUFFLE_FILTERS = 'SHUFFLE_FILTERS';
export const SET_FILTERS = 'SET_FILTERS';
export const REMOVE_FILTER = 'REMOVE_FILTER';
export const REMOVE_FILTER_BY_INDEX = 'REMOVE_FILTER_BY_INDEX';
export const REMOVE_FILTER_BY_SLUG = 'REMOVE_FILTER_BY_SLUG';
export const CLEAR_ALL_FILTERS = 'CLEAR_ALL_FILTERS';
export const ADD_ADVANCED_FILTER = 'ADD_ADVANCED_FILTER';
export const REMOVE_ADVANCED_FILTER = 'REMOVE_ADVANCED_FILTER';
export const SET_ADVANCED_FILTERS = 'SET_ADVANCED_FILTERS';

// search
export const ADD_SEARCH_TERM = 'ADD_SEARCH_TERM';
export const CLEAR_SEARCH_TERM = 'CLEAR_SEARCH_TERM';

// objectsQuery
export const OBJECTS_QUERY_SET_IS_PENDING = 'OBJECTS_QUERY_SET_IS_PENDING';
export const OBJECTS_QUERY_SET_HAS_MORE_RESULTS = 'OBJECTS_QUERY_SET_HAS_MORE_RESULTS';
export const OBJECTS_QUERY_SET_LAST_INDEX = 'OBJECTS_QUERY_SET_LAST_INDEX';
export const OBJECTS_QUERY_CURRENT_INDEX = 'OBJECTS_QUERY_CURRENT_INDEX';

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
export const CLASSNAME_MOBILE_PANEL_OPEN = 'mobile-panel-open';

// modal
export const MODAL_SHOW = 'MODAL_SHOW';
export const MODAL_HIDE = 'MODAL_HIDE';
export const MODAL_SET_PARENT_STATE = 'MODAL_SET_PARENT_STATE';

// urls
export const MAIN_WEBSITE_DOMAIN = process.env.REACT_APP_WWW_URL || '//www.barnesfoundation.org';
export const CANONICAL_ROOT = process.env.REACT_APP_CANONICAL_ROOT || 'https://collection.barnesfoundation.org';
export const NEWSLETTER_URL = process.env.REACT_APP_NEWSLETTER_URL;

// meta tag content
export const META_TITLE = process.env.REACT_APP_META_TITLE || 'Barnes Collection Online';
export const META_IMAGE = process.env.REACT_APP_META_IMAGE || '';
export const META_DESCRIPTION = process.env.REACT_APP_META_DESCRIPTION || '';
export const META_PLACENAME = process.env.REACT_APP_META_PLACENAME || '';
export const DEFAULT_TITLE_URL = process.env.DEFAULT_TITLE_URL || 'barnes-collection-object';

// breakpoints
export const BREAKPOINTS = {
  tablet_max: 989,
  mobile_max: 425
};

export const ART_OBJECT_GRID_INCREMENT = 12;

// default room order for tours, currently using the COVID flow
export const DEFAULT_ROOM_ORDER = [
  "Main Room",
  "Room 7",
  "Room 6",
  "Room 5",
  "Room 4",
  "Room 3",
  "Room 2",
  "Room 8",
  "Room 9",
  "Room 10",
  "Room 11",
  "Room 12",
  "Room 13",
  "Room 14",
  "Room 18",
  "Room 17",
  "Room 16",
  "Room 15",
  "Room 19",
  "Room 23",
  "Room 22",
  "Room 21",
  "Room 20",
  "Le Bonheur de vivre",
  "Second Floor Balcony East (Room 24)",
  "Mezzanine",
  "Gallery Foyer",
  "Lower Lobby",
];