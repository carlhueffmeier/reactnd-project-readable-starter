import { combineReducers } from 'redux';
import users from './users';
import modal from './modal';
import posts from './posts';
import form from './form';
import ui from './ui';

const entities = combineReducers({
  users,
  posts
});

const rootReducer = combineReducers({
  entities,
  modal,
  form,
  ui
});

export default rootReducer;
