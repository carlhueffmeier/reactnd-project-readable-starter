import { normalize } from 'normalizr';
import { defaults, pick, omit, get, at, without, union, flatMap } from 'lodash';
import configureAxios from 'helpers/configureAxios';

const axios = configureAxios();

// A common pattern is that we want to track progress of an
// asynchronous action.
// This helper creates three types for a single base type.
// For example:
// const POST_FETCHING = createTypes(`POST_FETCHING`);
//
// {
//   START: `POST_FETCHING_START`,
//   ERROR: `POST_FETCHING_ERROR`,
//   SUCCESS: `POST_FETCHING_SUCCESS`
// };
//
// The helper functions for fetching and the reducers below
// expect this type structure.
export function createTypes(baseType) {
  return {
    START: `${baseType}_START`,
    ERROR: `${baseType}_ERROR`,
    SUCCESS: `${baseType}_SUCCESS`
  };
}

// Makes a server request and updates redux store
//
// Options:
// dispatch: the dispatch function to use (required)
// schema: schema for normalization (required)
// url: Url of the api endpoint (required)
// method: The request method to use (default: `get`)
// data: Data to send with request (default: {})
// type: type conforming to structure described above
export class RequestHandler {
  constructor(options) {
    const defaultOptions = {
      method: `get`
    };
    Object.assign(this, defaults(options, defaultOptions));
  }

  makeAndHandleRequest() {
    this.makeRequest()
      .then(this.handleResponse.bind(this))
      .catch(this.handleError.bind(this));
  }

  makeRequest() {
    this.commenceRequest();
    const axiosOptions = pick(this, [`method`, `url`, `data`]);
    return axios(axiosOptions);
  }

  commenceRequest() {
    const action = { type: this.type.START };
    this.dispatch(action);
  }

  handleResponse(response) {
    console.log(`${this.method} ${this.url}`);
    console.log(response.data);
    const normalizedData = this.normalize(response.data);
    console.log(`normalized`, response.data);
    this.sendToReducer(normalizedData);
  }

  normalize(data) {
    return normalize(data, this.schema);
  }

  sendToReducer(payload) {
    const action = {
      type: this.type.SUCCESS,
      payload
    };
    this.dispatch(action);
  }

  handleError() {
    const action = {
      type: this.type.ERROR,
      error: this.errorMessage
    };
    this.dispatch(action);
  }
}

// Helper functions creating generic reducers to track state and errors
// according to the structure described above.
// Receives a type and an options field to set the initial state to a
// different value. (default: false)
// Example:
// const isFetching = statusReducer(POST_FETCHING, { initialState: true })
export function statusReducer(type, options = {}) {
  const { initialState = false } = options;
  return (state = initialState, action) => {
    switch (action.type) {
      case type.START:
        return true;
      case type.ERROR:
      case type.SUCCESS:
        return false;
      default:
        return state;
    }
  };
}

// Keeps track of the errors for all actionTypes
// Example:
// const error = errorReducer([POST_FETCHING, POST_ADDING, POST_EDITING, POST_DELETING])
export function errorReducer(actionTypes) {
  const errorTypes = flatMap(actionTypes, type => at(type, [`ERROR`]));
  const resetTypes = flatMap(actionTypes, type =>
    at(type, [`START`, `SUCCESS`])
  );
  return (state = ``, action) => {
    if (resetTypes.includes(action.type)) {
      return ``;
    }
    if (errorTypes.includes(action.type)) {
      return action.error;
    }
    return state;
  };
}

// Generic reducer creators for normalized server responses
// for use with the RequestHandler helper class above.
// `exceptions` receives a map of action types to transform functions
// receiving (state, action) returning the transformed state.
export function byIdReducer({ entityName, deleteActionType, exceptions = {} }) {
  const exceptionTypes = Object.keys(exceptions);
  return (state = {}, action) => {
    // Delete
    if (action.type === deleteActionType) {
      return omit(state, action.payload.result);
    }

    let newState = { ...state };

    // Add
    const entitiesToAdd = get(action, `payload.entities.${entityName}`);
    if (entitiesToAdd) {
      newState = {
        ...newState,
        ...entitiesToAdd
      };
    }

    // Apply transformations specified in exceptions
    if (exceptionTypes.includes(action.type)) {
      newState = exceptions[action.type](newState, action);
    }

    return newState;
  };
}

export function allIdsReducer({ entityName, deleteActionType }) {
  return (state = [], action) => {
    // Delete
    if (action.type === deleteActionType) {
      return without(state, action.payload.result);
    }
    // Add
    const entitiesToAdd = get(action, `payload.entities.${entityName}`);
    if (entitiesToAdd) {
      return union(state, Object.keys(entitiesToAdd));
    }

    return state;
  };
}
