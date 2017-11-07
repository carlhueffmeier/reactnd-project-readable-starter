import uniq from 'lodash';

const USER_AUTH = `USER_AUTH`;
const USER_UNAUTH = `USER_UNAUTH`;
const USER_FETCHING = `USER_FETCHING`;
const USER_FETCHING_ERROR = `USER_FETCHING_ERROR`;
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

function userFetchingSuccess(user) {
  return {
    type: USER_FETCHING_SUCCESS,
    user
  };
}

const initialState = {
  isFetching: true,
  error: '',
  isAuthed: false,
  authedId: '',
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
        authedId: ''
      };
    case USER_FETCHING:
      return {
        ...state,
        isFetching: true
      };
    case USER_FETCHING_ERROR:
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case USER_FETCHING_SUCCESS:
      return {
        ...state,
        isFetching: false,
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
