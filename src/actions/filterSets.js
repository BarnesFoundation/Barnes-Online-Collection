import { SELECT_FILTER_SET, CLOSE_FILTER_SET, TOGGLE_ARTIST_MENU } from '../constants';

export function selectFilterSet(slug) {
  return {
    type: SELECT_FILTER_SET,
    slug: slug
  }
};

export function closeFilterSet() {
  return {
    type: CLOSE_FILTER_SET,
  }
};

export const toggleArtistMenu = isOpen => ({ type: TOGGLE_ARTIST_MENU, isOpen });
