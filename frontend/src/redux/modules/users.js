import { combineReducers } from 'redux';
import { uniq, get } from 'lodash';
import { normalize } from 'normalizr';
import { userSchema } from 'schema';
import { getPostById } from 'redux/modules/posts';
import { getCommentById } from 'redux/modules/comments';
import { fetchAllVotes } from 'redux/modules/userVotes';
import axios from 'axios';

export const USER_AUTH = `USER_AUTH`;
export const USER_UNAUTH = `USER_UNAUTH`;
export const USER_FETCHING = `USER_FETCHING`;
export const USER_FETCHING_ERROR = `USER_FETCHING_ERROR`;
export const USER_FETCHING_SUCCESS = `USER_FETCHING_SUCCESS`;
export const USER_FETCHING_CANCEL = `USER_FETCHING_CANCEL`;
export const USER_FETCHING_DISMISS_ERROR = `USER_FETCHING_DISMISS_ERROR`;

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

function userFetchingSuccess(payload) {
  return {
    type: USER_FETCHING_SUCCESS,
    payload
  };
}

export function userFetchingCancel() {
  return {
    type: USER_FETCHING_CANCEL
  };
}

export function userFetchingDismissError() {
  return {
    type: USER_FETCHING_DISMISS_ERROR
  };
}

function addAndAuthenticateUser(user, dispatch) {
  const normalizedData = normalize(user, userSchema);
  dispatch(userFetchingSuccess(normalizedData));
  dispatch(userAuth(user.uid));
  dispatch(fetchAllVotes());
}

export function localLogin(username, password) {
  return dispatch => {
    dispatch(userFetching());
    // Return promise to allow chaining like this:
    // localLogin.then(/* close modal */)
    return new Promise(resolve => {
      axios
        .post(`/auth/local`, { username, password })
        .then(res => {
          addAndAuthenticateUser(res.data, dispatch);
          resolve();
        })
        .catch(() =>
          dispatch(userFetchingError(`Error during authentication.`))
        );
    });
  };
}

export function fetchCurrentUser() {
  return dispatch => {
    dispatch(userFetching());
    axios
      .get(`/api/current_user`)
      .then(res => {
        if (res.data.uid) {
          addAndAuthenticateUser(res.data, dispatch);
        } else {
          dispatch(userFetchingCancel());
        }
      })
      .catch(() =>
        dispatch(userFetchingError(`Error while fetching current user.`))
      );
  };
}

export function logout() {
  return dispatch => {
    axios
      .get(`/api/logout`)
      .then(() => dispatch(userUnauth()))
      .catch(() => console.warn(`Error during logout.`));
  };
}

// Reducer

export default combineReducers({
  isFetching,
  isAuthed,
  authedId,
  error,
  byId,
  allIds
});

function isFetching(state = true, action) {
  switch (action.type) {
    case USER_FETCHING:
      return true;
    case USER_FETCHING_ERROR:
    case USER_FETCHING_CANCEL:
    case USER_FETCHING_SUCCESS:
      return false;
    default:
      return state;
  }
}

function isAuthed(state = false, action) {
  switch (action.type) {
    case USER_AUTH:
      return true;
    case USER_UNAUTH:
      return false;
    default:
      return state;
  }
}

function authedId(state = ``, action) {
  switch (action.type) {
    case USER_AUTH:
      return action.uid;
    case USER_UNAUTH:
      return ``;
    default:
      return state;
  }
}

function error(state = ``, action) {
  switch (action.type) {
    case USER_FETCHING_ERROR:
      return action.error;
    case USER_FETCHING:
    case USER_FETCHING_DISMISS_ERROR:
    case USER_FETCHING_SUCCESS:
      return ``;
    default:
      return state;
  }
}

function byId(state = {}, action) {
  const newUsers = get(action, `payload.entities.users`);
  if (newUsers) {
    return {
      ...state,
      ...newUsers
    };
  }

  return state;
}

function allIds(state = [], action) {
  const newUsers = get(action, `payload.entities.users`);
  if (newUsers) {
    return uniq([...state, ...Object.keys(newUsers)]);
  }

  return state;
}

// Selectors

export function getCurrentUser({ entities }) {
  const { isAuthed, byId, authedId } = entities.users;
  return isAuthed ? byId[authedId] : null;
}

export function isUserAllowedToModifyPost(state, postId) {
  const post = getPostById(state, postId);
  return matchesCurrentUserId(state, post.author.uid);
}

export function isUserAllowedToModifyComment(state, commentId) {
  const comment = getCommentById(state, commentId);
  return matchesCurrentUserId(state, comment.author.uid);
}

function matchesCurrentUserId(state, uid) {
  const user = getCurrentUser(state);
  return Boolean(user && uid === user.uid);
}
