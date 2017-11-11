import { combineReducers } from 'redux';
import users from './users';
import modal from './modal';

const rootReducer = combineReducers({
  users,
  modal
});

export default rootReducer;
