import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from 'redux/modules';

const enhancers = [
  applyMiddleware(thunk),
  // Apply dev-tools middleware if present
  window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : f => f
];

const configureStore = () => {
  return createStore(rootReducer, compose(...enhancers));
};

export default configureStore;
