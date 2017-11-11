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
export const postSchema = new schema.Entity(`posts`, { author: userSchema });
export const commentSchema = new schema.Entity(`comments`, {
  author: userSchema
});
