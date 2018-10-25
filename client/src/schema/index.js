import { schema } from 'normalizr';

export const categorySchema = new schema.Entity(
  `categories`,
  {},
  { idAttribute: `path` }
);

export const userSchema = new schema.Entity(
  `users`,
  {},
  { idAttribute: `uid` }
);

export const postVotes = new schema.Entity(`postVotes`); // if type === `post` we find the votes here
export const commentVotes = new schema.Entity(`commentVotes`); // if type === `comment` we find the votes here

export const userVoteSchema = new schema.Union(
  {
    posts: postVotes,
    comments: commentVotes,
  },
  // A different schema is used for different `type` properties
  (value, parent, key) => `${value.type}s`
);

const processPostVotes = processUserVotes(`post`);
export const postNormalizeSchema = new schema.Entity(
  `posts`,
  {
    author: userSchema,
    // Is only a single value, but we want to store it separately in our redux store
    userVote: userVoteSchema,
  },
  {
    // We are using a process strategy to untangle the data
    processStrategy: processPostVotes,
  }
);

const processCommentVotes = processUserVotes(`comment`);
export const commentNormalizeSchema = new schema.Entity(
  `comments`,
  {
    author: userSchema,
    userVote: userVoteSchema,
  },
  {
    processStrategy: processCommentVotes,
  }
);

// We are replacing the single string value of userVotes (`upVote`, `downVote`)
// with an object including some metainfo that allow normalizr to correctly
// process our data.
// Adding this step allows us to keep our reducers simple.
function processUserVotes(type) {
  return (value, parent, key) => {
    if (!value.id) return null;
    const result = { ...value };
    result.userVote = {
      id: value.id,
      type,
      vote: value.userVote,
    };
    return result;
  };
}

// We don't want to denormalize userVotes, so for convenience
export const postDenormalizeSchema = new schema.Entity(`posts`, {
  author: userSchema,
});

export const commentDenormalizeSchema = new schema.Entity(`comments`, {
  author: userSchema,
});
