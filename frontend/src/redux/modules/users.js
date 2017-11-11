import uniq from 'lodash';
import { normalize } from 'normalizr';
import { userSchema } from 'schema';

const USER_AUTH = `USER_AUTH`;
const USER_UNAUTH = `USER_UNAUTH`;
const USER_FETCHING = `USER_FETCHING`;
const USER_FETCHING_ERROR = `USER_FETCHING_ERROR`;
const USER_FETCHING_DISMISS_ERROR = `USER_FETCHING_DISMISS_ERROR`;
const USER_FETCHING_SUCCESS = `USER_FETCHING_SUCCESS`;

function userAuth(uid) {
  return {
    type: USER_AUTH,
    uid
  };
}

function userUnauth() {
  return {
    type: USER_UNAUTH
  };
}

function userFetching() {
  return {
    type: USER_FETCHING
  };
}

function userFetchingError(error) {
  return {
    type: USER_FETCHING_ERROR,
    error
  };
}

export function userFetchingDismissError() {
  return {
    type: USER_FETCHING_DISMISS_ERROR
  };
}

function userFetchingSuccess(payload) {
  return {
    type: USER_FETCHING_SUCCESS,
    payload
  };
}

function fakeAuth(username, password) {
  return new Promise((resolve, reject) => {
    console.log(`logging in ${username} (${password})`);
    const result = {
      uid: 1,
      name: username
    };
    setTimeout(() => resolve({ data: result }), 2000);
    // setTimeout(() => reject(`Bad, baaaaad error. I can't handle this..`), 2000);
  });
}

export function localLogin(username, password) {
  return dispatch => {
    dispatch(userFetching());
    return new Promise(resolve => {
      fakeAuth(username, password)
        .then(res => {
          const normalizedData = normalize(res.data, userSchema);
          dispatch(userFetchingSuccess(normalizedData));
          dispatch(userAuth(res.data.uid));
          resolve();
        })
        .catch(error => dispatch(userFetchingError(error)));
    });
  };
}

const initialState = {
  isFetching: false,
  error: ``,
  isAuthed: false,
  authedId: ``,
  byId: {},
  allIds: []
};

export default function users(state = initialState, action) {
  switch (action.type) {
    case USER_AUTH:
      return {
        ...state,
        isAuthed: true,
        authedId: action.uid
      };
    case USER_UNAUTH:
      return {
        ...state,
        isAuthed: false,
        authedId: ``
      };
    case USER_FETCHING:
      return {
        ...state,
        isFetching: true,
        error: ``
      };
    case USER_FETCHING_ERROR:
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case USER_FETCHING_DISMISS_ERROR:
      return {
        ...state,
        error: ``
      };
    case USER_FETCHING_SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: ``,
        byId: byId(state.byId, action),
        allIds: allIds(state.allIds, action)
      };
    default:
      return state;
  }
}

function byId(state, action) {
  switch (action.type) {
    case USER_FETCHING_SUCCESS:
      console.log(action);
      return {
        ...state,
        ...action.payload.entities.users
      };
    default:
      return state;
  }
}

function allIds(state, action) {
  switch (action.type) {
    case USER_FETCHING_SUCCESS:
      return uniq([...state, ...Object.keys(action.payload.entities.users)]);
    default:
      return state;
  }
}
