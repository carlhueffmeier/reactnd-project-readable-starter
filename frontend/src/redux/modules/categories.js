import { combineReducers } from 'redux';
import {
  createTypes,
  RequestHandler,
  statusReducer,
  errorReducer
} from 'helpers/redux';
import { categorySchema } from 'schema';

const CATEGORY_FETCHING = createTypes(`CATEGORY_FETCHING`);

export function fetchCategories(id) {
  return dispatch => {
    const options = {
      dispatch,
      schema: [categorySchema],
      url: `/api/categories`,
      errorMessage: `Error fetching categories.`,
      type: CATEGORY_FETCHING
    };
    const handler = new RequestHandler(options);
    handler.makeAndHandleRequest();
  };
}

export default combineReducers({
  isFetching: statusReducer(CATEGORY_FETCHING, { initialState: true }),
  error: errorReducer([CATEGORY_FETCHING]),
  byId,
  allIds
});

function byId(state = {}, action) {
  if (action.type === CATEGORY_FETCHING.SUCCESS) {
    return action.payload.entities.categories;
  }
  return state;
}

function allIds(state = [], action) {
  if (action.type === CATEGORY_FETCHING.SUCCESS) {
    return Object.keys(action.payload.entities.categories);
  }
  return state;
}

export function getCategories({ entities }) {
  const { allIds, byId } = entities.categories;
  return allIds.map(categoryId => byId[categoryId]);
}
