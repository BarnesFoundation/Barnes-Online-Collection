import { combineReducers } from 'redux';
import objects from './reducers/objects';
import query from './reducers/query';

export default combineReducers({ objects, query });