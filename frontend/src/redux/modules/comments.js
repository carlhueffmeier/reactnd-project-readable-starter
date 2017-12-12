import { denormalize } from 'normalizr';
import { commentNormalizeSchema, commentDenormalizeSchema } from 'schema';
import { v4 } from 'uuid';
import { without, get, union } from 'lodash';
import { combineReducers } from 'redux';
import {
  createTypes,
  RequestHandler,
  statusReducer,
  byIdReducer,
  allIdsReducer,
  errorReducer
} from 'helpers/redux';
import { stripMetainfo } from 'helpers/utils';

const COMMENT_FETCHING = createTypes(`COMMENT_FETCHING`);
// Exporting for form reducer:
// We want to reset the "new comment" form after the new comment is succesfully saved.
export const COMMENT_ADDING = createTypes(`COMMENT_ADDING`);
// Exporting for ui reducer:
// We want to reset the `commentEditing` field when editing is successful.
// Reseting it will close the edit form
export const COMMENT_EDITING = createTypes(`COMMENT_EDITING`);
const COMMENT_DELETING = createTypes(`COMMENT_DELETING`);

export function fetchCommentsForPost(id) {
  return dispatch => {
    const options = {
      dispatch,
      schema: [commentNormalizeSchema],
      url: `/api/posts/${id}/comments`,
      errorMessage: `Error fetching comments for postId: '${id}'.`,
      type: COMMENT_FETCHING
    };
    const handler = new RequestHandler(options);
    handler.makeAndHandleRequest();
  };
}

export function createAndSaveNewComment(newCommentProps) {
  return dispatch => {
    const newComment = createNewComment(newCommentProps);
    const options = {
      dispatch,
      schema: commentNormalizeSchema,
      url: `/api/comments`,
      method: `post`,
      data: newComment,
      errorMessage: `Error saving comment.`,
      type: COMMENT_ADDING
    };
    const handler = new RequestHandler(options);
    handler.makeAndHandleRequest();
  };
}

function createNewComment(props) {
  return {
    ...props,
    id: v4(),
    timestamp: Date.now()
  };
}

export function editComment(id, updatedContent) {
  return dispatch => {
    const options = {
      dispatch,
      schema: commentNormalizeSchema,
      url: `/api/comments/${id}`,
      method: `put`,
      data: updatedContent,
      errorMessage: `Error saving changes.`,
      type: COMMENT_EDITING
    };
    const handler = new RequestHandler(options);
    handler.makeAndHandleRequest();
  };
}

export function deleteComment(id) {
  return dispatch => {
    const options = {
      dispatch,
      schema: commentNormalizeSchema,
      url: `/api/comments/${id}`,
      method: `delete`,
      errorMessage: `Error deleting comment.`,
      type: COMMENT_DELETING
    };
    const handler = new RequestHandler(options);
    handler.makeAndHandleRequest();
  };
}

// Reducer

export default combineReducers({
  isFetching: statusReducer(COMMENT_FETCHING, { initialState: true }),
  isAdding: statusReducer(COMMENT_ADDING),
  isEditing: statusReducer(COMMENT_EDITING),
  isDeleting: statusReducer(COMMENT_DELETING),
  byId: byIdReducer({
    entityName: `comments`,
    deleteActionType: COMMENT_DELETING.SUCCESS
  }),
  allIds: allIdsReducer({
    entityName: `comments`,
    deleteActionType: COMMENT_DELETING.SUCCESS
  }),
  error: errorReducer([
    COMMENT_FETCHING,
    COMMENT_ADDING,
    COMMENT_EDITING,
    COMMENT_DELETING
  ]),
  byPost
});

// Keeping a separate reference by post id to facilitate look up
function byPost(state = {}, action) {
  const comments = get(action, `payload.entities.comments`);
  // Delete
  if (action.type === COMMENT_DELETING.SUCCESS) {
    return removeCommentFromParentLookupTable(state, comments);
  }
  // Add
  if (comments) {
    return addCommentToParentLookupTable(state, comments);
  }

  return state;
}

function addCommentToParentLookupTable(state, comments) {
  const commentsToAdd = Object.values(comments);
  const nextState = { ...state };
  commentsToAdd.forEach(({ id, parentId }) => {
    nextState[parentId] = union(nextState[parentId], [id]);
  });
  return nextState;
}

function removeCommentFromParentLookupTable(state, comments) {
  const commentsToRemove = Object.values(comments);
  const nextState = { ...state };
  commentsToRemove.forEach(({ id, parentId }) => {
    nextState[parentId] = without(nextState[parentId], id);
  });
  return nextState;
}

// Selectors

export function getCommentsForPost({ entities }, postId) {
  const commentIds = getCommentIdsForPost(entities.comments, postId);
  if (!commentIds) {
    return [];
  }
  return denormalizeComments(commentIds, entities);
}

function getCommentIdsForPost(comments, postId) {
  return comments.byPost[postId];
}

export function getCommentById({ entities }, id) {
  return denormalizeComments([id], entities)[0];
}

function denormalizeComments(commentIds, entities) {
  const denormalizedData = denormalize(
    { comments: commentIds },
    { comments: [commentDenormalizeSchema] },
    stripMetainfo(entities)
  );
  return denormalizedData.comments;
}
