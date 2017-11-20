import { denormalize } from 'normalizr';
import { postSchema } from 'schema';
import { v4 } from 'uuid';
import { omit, without, uniq, forEach } from 'lodash';
import { combineReducers } from 'redux';
import RequestHandler from 'helpers/RequestHandler';

const POST_FETCHING = {
  START: `POST_FETCHING_START`,
  ERROR: `POST_FETCHING_ERROR`,
  SUCCESS: `POST_FETCHING_SUCCESS`
};

const POST_ADDING = {
  START: `POST_ADDING`,
  ERROR: `POST_ADDING_ERROR`,
  SUCCESS: `POST_ADDING_SUCCESS`
};

const POST_EDITING = {
  START: `POST_EDITING_START`,
  ERROR: `POST_EDITING_ERROR`,
  SUCCESS: `POST_EDITING_SUCCESS`
};

const POST_DELETING = {
  START: `POST_DELETING_START`,
  ERROR: `POST_DELETING_ERROR`,
  SUCCESS: `POST_DELETING_SUCCESS`
};

export function fetchAllPosts() {
  return dispatch => {
    const options = {
      dispatch,
      schema: [postSchema],
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
      schema: [postSchema],
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
      schema: postSchema,
      url: `/api/posts/${id}`,
      errorMessage: `Error fetching posts by ID.`,
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
      schema: postSchema,
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
      schema: postSchema,
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

export function votePostUp(id) {
  return votePost(id, `upVote`);
}

export function votePostDown(id) {
  return votePost(id, `downVote`);
}

function votePost(id, upOrDownVote) {
  return dispatch => {
    const options = {
      dispatch,
      schema: postSchema,
      url: `/api/posts/${id}`,
      method: `post`,
      data: { option: upOrDownVote },
      errorMessage: `Error saving vote.`,
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
      schema: postSchema,
      url: `/api/posts/${id}`,
      method: `delete`,
      errorMessage: `Error deleting vote.`,
      type: POST_DELETING
    };
    const handler = new RequestHandler(options);
    handler.makeAndHandleRequest();
  };
}

// Reducer

export default combineReducers({
  isFetching: statusReducer(POST_FETCHING),
  isAdding: statusReducer(POST_ADDING),
  isEditing: statusReducer(POST_EDITING),
  isDeleting: statusReducer(POST_DELETING),
  error,
  byId,
  allIds
});

function statusReducer(type) {
  return (state = false, action) => {
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

function error(state = ``, action) {
  switch (action.type) {
    case POST_FETCHING.START:
    case POST_ADDING.START:
    case POST_EDITING.START:
    case POST_DELETING.START:
      return ``;
    case POST_FETCHING.ERROR:
    case POST_ADDING.ERROR:
    case POST_EDITING.ERROR:
    case POST_DELETING.ERROR:
      return action.error;
    default:
      return state;
  }
}

function byId(state = {}, action) {
  switch (action.type) {
    case POST_FETCHING.SUCCESS:
    case POST_ADDING.SUCCESS:
    case POST_EDITING.SUCCESS:
      return {
        ...state,
        ...action.payload.entities.posts
      };
    case POST_DELETING.SUCCESS:
      return omit(state, action.payload.result);
    default:
      return state;
  }
}

function allIds(state = [], action) {
  switch (action.type) {
    case POST_FETCHING.SUCCESS:
    case POST_ADDING.SUCCESS:
      return uniq([...state, ...action.payload.result]);
    case POST_DELETING.SUCCESS:
      return without(state, action.payload.result);
    default:
      return state;
  }
}

// Selectors

export function getAllPosts({ entities }) {
  const { posts } = entities;
  return denormalizePosts(posts.allIds, entities);
}

export function getPostById({ entities }, id) {
  return denormalizePosts([id], entities)[0];
}

export function getPostByCategory({ entities }, category) {
  const { posts } = entities;
  const filteredIds = posts.allIds.filter(
    id => posts.byId[id].category === category
  );
  return denormalizePosts(filteredIds, entities);
}

function denormalizePosts(postIds, entities) {
  const denormalizedData = denormalize(
    { posts: postIds },
    { posts: [postSchema] },
    stripMetainfo(entities)
  );
  return denormalizedData.posts;
}

function stripMetainfo(entities) {
  const entitiesWithoutMetainfo = {};
  forEach(entities, (value, key) => {
    entitiesWithoutMetainfo[key] = value.byId;
  });
  return entitiesWithoutMetainfo;
}
