import { createTypes, RequestHandler } from 'helpers/redux';
import { VOTE_UP, VOTE_DOWN, VOTE_NONE } from 'helpers/constants';
import { merge, get } from 'lodash';
import { combineReducers } from 'redux';
import { userVoteSchema } from 'schema';
import { USER_UNAUTH } from 'redux/modules/users';
import { postNormalizeSchema, commentNormalizeSchema } from 'schema';

const VOTE_SAVE = createTypes(`VOTE`);
const VOTE_FETCH = createTypes(`VOTE_FETCH`);

// Actions

function saveVote({ endpoint, schema, id, vote }) {
  return dispatch => {
    const options = {
      dispatch,
      schema,
      url: `/api/${endpoint}/${id}`,
      method: `post`,
      data: { vote },
      errorMessage: `Error saving vote.`,
      type: VOTE_SAVE
    };
    const handler = new RequestHandler(options);
    handler.makeAndHandleRequest();
  };
}

export function votePostUp(id) {
  return saveVote({
    endpoint: `posts`,
    schema: postNormalizeSchema,
    vote: VOTE_UP,
    id
  });
}

export function votePostDown(id) {
  return saveVote({
    endpoint: `posts`,
    schema: postNormalizeSchema,
    vote: VOTE_DOWN,
    id
  });
}

export function votePostReset(id) {
  return saveVote({
    endpoint: `posts`,
    schema: postNormalizeSchema,
    vote: VOTE_NONE,
    id
  });
}

export function voteCommentUp(id) {
  return saveVote({
    endpoint: `comments`,
    schema: commentNormalizeSchema,
    vote: VOTE_UP,
    id
  });
}

export function voteCommentDown(id) {
  return saveVote({
    endpoint: `comments`,
    schema: commentNormalizeSchema,
    vote: VOTE_DOWN,
    id
  });
}

export function voteCommentReset(id) {
  return saveVote({
    endpoint: `comments`,
    schema: commentNormalizeSchema,
    vote: VOTE_NONE,
    id
  });
}

export function fetchAllVotes() {
  return dispatch => {
    const options = {
      dispatch,
      schema: [userVoteSchema],
      url: `/api/votes`,
      method: `get`,
      errorMessage: `Error fetching user votes.`,
      type: VOTE_FETCH
    };
    const handler = new RequestHandler(options);
    handler.makeAndHandleRequest();
  };
}

// Reducer

export default combineReducers({
  posts: votesReducer(`post`),
  comments: votesReducer(`comment`)
});

function votesReducer(type) {
  return (state = {}, action) => {
    if (action.type === USER_UNAUTH) {
      return {};
    }
    const votes = get(action, `payload.entities.${type}Votes`);
    if (votes) {
      const processed = Object.assign(
        {},
        ...Object.keys(votes).map(key => ({ [votes[key].id]: votes[key].vote }))
      );
      return merge({}, state, processed);
    }

    return state;
  };
}

export function getUserVoteForPost({ entities }, id) {
  return entities.userVotes.posts[id] || VOTE_NONE;
}

export function getUserVoteForComment({ entities }, id) {
  return entities.userVotes.comments[id] || VOTE_NONE;
}
