const UI_CHANGE_POST_SORT_ORDER = `UI_CHANGE_POST_SORT_ORDER`;
const UI_CHANGE_COMMENT_SORT_ORDER = `UI_CHANGE_COMMENT_SORT_ORDER`;

export function changePostSortOrder(order) {
  return {
    type: UI_CHANGE_POST_SORT_ORDER,
    order
  };
}

export function changeCommentSortOrder(order) {
  return {
    type: UI_CHANGE_COMMENT_SORT_ORDER,
    order
  };
}

const initialState = {
  postSortOrder: `date`,
  commentSortOrder: `date`
};

export default function ui(state = initialState, action) {
  switch (action.type) {
    case UI_CHANGE_POST_SORT_ORDER:
      return {
        ...state,
        postSortOrder: action.order
      };
    case UI_CHANGE_COMMENT_SORT_ORDER:
      return {
        ...state,
        commentSortOrder: action.order
      };
    default:
      return state;
  }
}
