import { COMMENT_EDITING } from 'redux/modules/comments';
import { combineReducers } from 'redux';
const UI_CHANGE_POST_SORT_ORDER = `UI_CHANGE_POST_SORT_ORDER`;
const UI_CHANGE_COMMENT_SORT_ORDER = `UI_CHANGE_COMMENT_SORT_ORDER`;
const UI_BEGIN_EDITING_COMMENT = `UI_BEGIN_EDITING_COMMENT`;
const UI_STOP_EDITING_COMMENT = `UI_STOP_EDITING_COMMENT`;

export function changePostSortOrder(order) {
  return {
    type: UI_CHANGE_POST_SORT_ORDER,
    order,
  };
}

export function changeCommentSortOrder(order) {
  return {
    type: UI_CHANGE_COMMENT_SORT_ORDER,
    order,
  };
}

export function beginEditingComment(commentId) {
  return {
    type: UI_BEGIN_EDITING_COMMENT,
    commentId,
  };
}

export function stopEditingComment(order) {
  return {
    type: UI_STOP_EDITING_COMMENT,
  };
}

export default combineReducers({
  postSortOrder: updateOrderReducer(UI_CHANGE_POST_SORT_ORDER),
  commentSortOrder: updateOrderReducer(UI_CHANGE_COMMENT_SORT_ORDER),
  commentEditing, // keeps the comment currently being edited
});

function updateOrderReducer(updateType) {
  return (state = `date`, action) =>
    action.type === updateType ? action.order : state;
}

function commentEditing(state = null, action) {
  const setType = UI_BEGIN_EDITING_COMMENT;
  // Close edit form once changes are successfully saved, too
  const resetTypes = [UI_STOP_EDITING_COMMENT, COMMENT_EDITING.SUCCESS];

  if (resetTypes.includes(action.type)) return null;
  if (action.type === setType) return action.commentId;
  return state;
}
