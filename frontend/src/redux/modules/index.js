import { combineReducers } from 'redux';
import users from './users';
import posts from './posts';
import comments from './comments';
import categories from './categories';
import userVotes from './userVotes';
import modal from './modal';
import form from './form';
import ui from './ui';

const entities = combineReducers({
  users,
  posts,
  comments,
  categories,
  userVotes
});

const rootReducer = combineReducers({
  entities,
  modal,
  form,
  ui
});

export default rootReducer;
