import { combineReducers } from 'redux';
import objects from './reducers/objects';
import query from './reducers/query';
import searchTags from './reducers/searchTags';

export default combineReducers({ objects, query, searchTags });