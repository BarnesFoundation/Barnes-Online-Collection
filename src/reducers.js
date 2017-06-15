import { combineReducers } from 'redux';
import objects from './reducers/objects';
import object from './reducers/object';
import query from './reducers/query';
import searchTags from './reducers/searchTags';

export default combineReducers({ objects, object, query, searchTags });