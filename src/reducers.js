import { combineReducers } from 'redux';
import objects from './reducers/objects';
import object from './reducers/object';
import query from './reducers/query';
import queries from './reducers/queries';
import filters from './reducers/filters';
import searchTags from './reducers/searchTags';
import prints from './reducers/prints';
import ui from './reducers/ui';

export default combineReducers({ objects, object, query, queries, filters, searchTags, prints, ui });
