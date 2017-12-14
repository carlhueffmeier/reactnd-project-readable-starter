import { denormalize } from 'normalizr';
import { postNormalizeSchema, postDenormalizeSchema } from 'schema';
import { v4 } from 'uuid';
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
import { COMMENT_ADDING, COMMENT_DELETING } from 'redux/modules/comments';

export const POST_FETCHING = createTypes(`POST_FETCHING`);
export const POST_ADDING = createTypes(`POST_ADDING`);
export const POST_EDITING = createTypes(`POST_EDITING`);
export const POST_DELETING = createTypes(`POST_DELETING`);

export function fetchAllPosts() {
  return dispatch => {
    const options = {
      dispatch,
      schema: [postNormalizeSchema],
      url: `/api/posts`,
      errorMessage: `Error fetching posts.`,
      type: POST_FETCHING
    };
    const handler = new RequestHandler(options);
    handler.makeAndHandleRequest();
  };
}

export function fetchPostsByCategory(categoryId) {
  return dispatch => {
    const options = {
      dispatch,
      schema: [postNormalizeSchema],
      url: `/api/${categoryId}/posts`,
      errorMessage: `Error fetching posts by category.`,
      type: POST_FETCHING
    };
    const handler = new RequestHandler(options);
    handler.makeAndHandleRequest();
  };
}

export function fetchPostById(id) {
  return dispatch => {
    const options = {
      dispatch,
      schema: postNormalizeSchema,
      url: `/api/posts/${id}`,
      errorMessage: `Error fetching post by ID.`,
      type: POST_FETCHING
    };
    const handler = new RequestHandler(options);
    handler.makeAndHandleRequest();
  };
}

export function createAndSaveNewPost(newPostProps) {
  return dispatch => {
    const newPost = createNewPost(newPostProps);
    const options = {
      dispatch,
      schema: postNormalizeSchema,
      url: `/api/posts`,
      method: `post`,
      data: newPost,
      errorMessage: `Error saving post.`,
      type: POST_ADDING
    };
    const handler = new RequestHandler(options);
    handler.makeAndHandleRequest();
  };
}

function createNewPost(props) {
  return {
    ...props,
    id: v4(),
    timestamp: Date.now()
  };
}

export function editPost(id, updatedContent) {
  return dispatch => {
    const options = {
      dispatch,
      schema: postNormalizeSchema,
      url: `/api/posts/${id}`,
      method: `put`,
      data: updatedContent,
      errorMessage: `Error saving changes.`,
      type: POST_EDITING
    };
    const handler = new RequestHandler(options);
    handler.makeAndHandleRequest();
  };
}

export function deletePost(id) {
  return dispatch => {
    const options = {
      dispatch,
      schema: postNormalizeSchema,
      url: `/api/posts/${id}`,
      method: `delete`,
      errorMessage: `Error deleting post.`,
      type: POST_DELETING
    };
    const handler = new RequestHandler(options);
    handler.makeAndHandleRequest();
  };
}

// Reducer

export default combineReducers({
  isFetching: statusReducer(POST_FETCHING, { initialState: true }),
  isAdding: statusReducer(POST_ADDING),
  isEditing: statusReducer(POST_EDITING),
  isDeleting: statusReducer(POST_DELETING),
  byId: byIdReducer({
    entityName: `posts`,
    deleteActionType: POST_DELETING.SUCCESS,
    exceptions: {
      [COMMENT_ADDING.SUCCESS]: changeCommentCountBy(1),
      [COMMENT_DELETING.SUCCESS]: changeCommentCountBy(-1)
    }
  }),
  allIds: allIdsReducer({
    entityName: `posts`,
    deleteActionType: POST_DELETING.SUCCESS
  }),
  error: errorReducer([POST_FETCHING, POST_ADDING, POST_EDITING, POST_DELETING])
});

function changeCommentCountBy(difference) {
  return (state, { payload }) => {
    const commentId = payload.result;
    const parentId = payload.entities.comments[commentId].parentId;
    return {
      ...state,
      [parentId]: {
        ...state[parentId],
        commentCount: state[parentId].commentCount + difference
      }
    };
  };
}

// Selectors

export function getAllPosts({ entities }) {
  const { posts } = entities;
  return denormalizePosts(posts.allIds, entities);
}

export function getPostById({ entities }, id) {
  return denormalizePosts([id], entities)[0];
}

export function getPostsByCategory({ entities }, category) {
  const { posts } = entities;
  const filteredIds = posts.allIds.filter(
    id => posts.byId[id].category === category
  );
  return denormalizePosts(filteredIds, entities);
}

function denormalizePosts(postIds, entities) {
  const denormalizedData = denormalize(
    { posts: postIds },
    { posts: [postDenormalizeSchema] },
    stripMetainfo(entities)
  );
  return denormalizedData.posts;
}
