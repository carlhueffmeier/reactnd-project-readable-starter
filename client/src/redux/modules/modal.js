export const MODAL_OPEN = `MODAL_OPEN`;
export const MODAL_CLOSE = `MODAL_CLOSE`;
export const MODAL_UPDATE_USERNAME = `MODAL_UPDATE_USERNAME`;
export const MODAL_UPDATE_PASSWORD = `MODAL_UPDATE_PASSWORD`;

export function modalOpen() {
  return {
    type: MODAL_OPEN,
  };
}

export function modalClose() {
  return {
    type: MODAL_CLOSE,
  };
}

export function modalUpdateUsername(username) {
  return {
    type: MODAL_UPDATE_USERNAME,
    username,
  };
}

export function modalUpdatePassword(password) {
  return {
    type: MODAL_UPDATE_PASSWORD,
    password,
  };
}

const initialState = {
  username: ``,
  password: ``,
  isOpen: false,
};

export default function modal(state = initialState, action) {
  switch (action.type) {
    case MODAL_OPEN:
      return {
        ...state,
        isOpen: true,
      };
    case MODAL_CLOSE:
      return {
        username: ``,
        password: ``,
        isOpen: false,
      };
    case MODAL_UPDATE_USERNAME:
      return {
        ...state,
        username: action.username,
      };
    case MODAL_UPDATE_PASSWORD:
      return {
        ...state,
        password: action.password,
      };
    default:
      return state;
  }
}
