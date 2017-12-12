# API Server

To install and start the API server, run the following commands in this
directory:

* `npm install`
* `node server`

## Using The Server

### Include An Authorization Header

All requests should use an **Authorization header** to work with your own data:

```js
fetch(url, {
  headers: { Authorization: 'whatever-you-want' }
});
```

### Comment Counts

Posts retrieved in a list or individually now contain comment counts in the
format `post: { commentCount: 0 }`. This should make it easier to display the
number of comments a post has without having to call the comments endpoint for
each post. This count is updated whenever a comment is added or deleted via the
`POST /comments` or `DELETE /comments/:id` endpoints.

### Authentication

I added passport authentication for a very simple local strategy and Google sign
in. For Google OAuth to work, it is necessary to add the required keys to
`config/keys.js`.

See `config/keys.example.js` for a template.

### API Endpoint

The following endpoints are available:

| Endpoints                     | Usage                                                                                                                           | Params                                                                                                                                                                                                                                                                                                                                                            |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET /api/categories`         | Get all of the categories available for the app. List is found in `categories.js`. Feel free to extend this list as you desire. |                                                                                                                                                                                                                                                                                                                                                                   |
| `GET /api/:category/posts`    | Get all of the posts for a particular category.                                                                                 |                                                                                                                                                                                                                                                                                                                                                                   |
| `GET /api/posts`              | Get all of the posts. Useful for the main page when no category is selected.                                                    |                                                                                                                                                                                                                                                                                                                                                                   |
| `POST /api/posts`             | Add a new post.                                                                                                                 | **id** - UUID should be fine, but any unique id will work <br> **timestamp** - [Timestamp] Can in whatever format you like, you can use `Date.now()` if you like. <br> **title** - [String] <br> **body** - [String] <br> **author** - [String] <br> **category** - Any of the categories listed in `categories.js`. Feel free to extend this list as you desire. |
| `GET /api/posts/:id`          | Get the details of a single post.                                                                                               |                                                                                                                                                                                                                                                                                                                                                                   |
| `POST /api/posts/:id`         | Used for voting on a post.                                                                                                      | **option** - [String]: Either `"upVote"` or `"downVote"`.                                                                                                                                                                                                                                                                                                         |
| `PUT /api/posts/:id`          | Edit the details of an existing post.                                                                                           | **title** - [String] <br> **body** - [String]                                                                                                                                                                                                                                                                                                                     |
| `DELETE /api/posts/:id`       | Sets the deleted flag for a post to 'true'. <br> Sets the parentDeleted flag for all child comments to 'true'.                  |                                                                                                                                                                                                                                                                                                                                                                   |
| `GET /api/posts/:id/comments` | Get all the comments for a single post.                                                                                         |                                                                                                                                                                                                                                                                                                                                                                   |
| `POST /api/comments`          | Add a comment to a post.                                                                                                        | **id** - Any unique ID. As with posts, UUID is probably the best here. <br> **timestamp** - [Timestamp] Get this however you want. <br> **body** - [String] <br> **author** - [String] <br> **parentId** - Should match a post id in the database.                                                                                                                |
| `GET /api/comments/:id`       | Get the details for a single comment.                                                                                           |                                                                                                                                                                                                                                                                                                                                                                   |
| `POST /api/comments/:id`      | Used for voting on a comment.                                                                                                   | **option** - [String]: Either `"upVote"` or `"downVote"`.                                                                                                                                                                                                                                                                                                         |
| `PUT /api/comments/:id`       | Edit the details of an existing comment.                                                                                        | **timestamp** - timestamp. Get this however you want. <br> **body** - [String]                                                                                                                                                                                                                                                                                    |
| `DELETE /api/comments/:id`    | Sets a comment's deleted flag to `true`.                                                                                        | &nbsp;                                                                                                                                                                                                                                                                                                                                                            |
| `GET /api/votes`              | Get all the users votes.                                                                                                        | &nbsp;                                                                                                                                                                                                                                                                                                                                                            |
| `GET /auth/google`            | Start Google OAuth authentication.                                                                                              | &nbsp;                                                                                                                                                                                                                                                                                                                                                            |
| `POST /auth/local`            | Start local authentication.                                                                                                     | **username** - [String]<br>**password** - [String]                                                                                                                                                                                                                                                                                                                |
| `GET /api/logout`             | Logout the current user.                                                                                                        |                                                                                                                                                                                                                                                                                                                                                                   |
| `GET /api/current_user`       | Get the currently logged in user.                                                                                               |                                                                                                                                                                                                                                                                                                                                                                   |
