import { combineReducers } from 'redux';
import users from './users';
import modal from './modal';
import posts from './posts';

const entities = combineReducers({
  users,
  posts
});

const rootReducer = combineReducers({
  entities,
  modal
});

export default rootReducer;
