# ReactND: Readable

The second project of the [Udacity React Nanodegree](
https://www.udacity.com/course/react-nanodegree--nd019).

The goal is to create a content website similar to Reddit. Users can post content to predefined categories, comment on their posts and other users' posts, and vote on posts and comments. Users can also edit and delete posts and comments.

## Getting Started
1. Install [npm](https://www.npmjs.com/get-npm)
2. Install [Git](https://git-scm.com/downloads)
3. Open a terminal and change to the location you want to save the application folder to
4. Enter `git clone https://github.com/carlhueffmeier/reactnd-readable.git` to download the project directory
5. Enter `cd reactnd-readable` to open the project directory
6. Enter `npm install` to install all requirements
7. You need to repeat this step for the API server
8. Enter `cd api-server` to open the server directory
9. Enter `npm install` to install all server requirements
11. Enter `cd ..` to return to the project's root directory
12. Enter `npm start` to launch the server
13. If it doesn't open automatically, browse to `localhost:3000` in your web browser
14. Enjoy

## API Server

Information about the API server and how to use it can be found in its [README file](api-server/README.md).

## Requirements

The App should have at least 4 views:

**Post List View**
- should list all available categories, which should link to a category view for that category
- should list all of the posts ordered by voteScore (highest score first)
- should have a control for changing the sort method for the list, including at minimum, order by voteScore and order by timestamp
- should have a control for adding a new post

**Category View**
- identical to the default view, but filtered to only include posts with the selected category

**Post Detail View**
- should show the details of a post, including: Title, Body, Author, timestamp (in user readable format), and vote score
- should list all of the comments for that post, ordered by voteScore (highest first)
- should have a control for reordering comments by score or timestamp
- should have controls to edit or delete the post
- should have a control to add a new comment.
- implement comment form however you want (inline, modal, etc.)
- comments should also have controls for editing or deleting

**Create/Edit View**
- should have a form to create new post or edit existing posts
- when editing, existing data should be populated in the form

See the [project rubric](https://review.udacity.com/#!/rubrics/1017/view) for detailed project requirements.

## Development Log

### Run-scripts
After downloading the starter code, the first step is to add the frontend.
- `create-react-app frontend`

Running the server and the frontend in multiple terminal windows seemed cumbersome, so let's set up npm scripts in the root directory.

First we initialize the `package.json`.
```
npm init -y
```

The `-y` or `--yes` flag initializes the `package.json` using default values.

Next we add the scripts to run our server and frontend.
```
[package.json]

"scripts": {
  "server": "cd api-server && node server.js",
  "client": "cd frontend && npm start",
},
```
Ok, now we can start our server and client from the project's root directory, but we still need two commands to execute our scripts. We can do better. The package `concurrently` can help us with that.
```
npm i -D concurrently
```
We add an additional npm script to our project root
```
[package.json]

"scripts": {
  ...
  "start": "concurrent \"npm run server\" \"npm run client\""
},
```
Our `start` script executes both of our scripts at the same time, so we can start developing just by calling `npm start`.

Our frontend runs with the `webpack-dev-server` and any changes will be reflected instantly. Our backend on the other hand runs as a normal node instance and we would have to stop and restart our script every single time to test changes to our server code.

There is a package called `nodemon` to help us with that.
```
cd api-server
npm i -D nodemon
```
To the `package.json` of our api-server, we add the following scripts:
```
[api-server/package.json]

"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
},
```
Now, running `npm run dev` will start our development server.

Let's update our project's npm script accordingly.
```
[package.json]
"scripts": {
  "server": "cd api-server && npm run dev",
  ...
},
```

### Redux Schema
Before we go ahead and set up our reducers and redux store, let's pause for a second and figure out what information we want to keep in redux.

In our application we have Posts, Users, Categories and Comments. Every Post is associated with a single User and a single Category. A Post can have multiple Comments associated with it.

What we get, is a general schema like this:

```
**Posts**
- id: string
- timestamp: integer
- title: string
- body: string
- author: foreign key to Users
- category: foreign key to Categories
- voteScore: integer
- commentCount: integer

**Users**
- login: string (used as the primary key)
- displayName: string

**Categories**
- path: string (used as the primary key)
- name: string

**Comments**
- id: string
- parentId: foreign key to Posts
- timestamp: integer
- body: string
- author: foreign key to Users
- voteScore: integer
```

Let's get a little bit more concrete and start designing our redux store. In addition to the data we get from our api-server, we will also need to store some status information:
- Is the user authorized?
- Are the comments currently fetching?
- ...

Our frontend needs to know about those things in order to display everything correctly.

Taking that into consideration, we need at least the following information in our store.

```
posts: {
  isFetching,
  error,
  byId: {
    [id]: {
      timestamp,
      title,
      body,
      author,
      category,
      voteScore,
      commentCount,
    }
  },
  allIds: [],
}

users: {
  isAuthed,
  isFetching,
  error,
  authedId,
  byId: {
    id,
    displayName,
  },
  allIds: [],
}

categories: {
  isFetching,
  error,
  byId: {
    [id]: {
      path,
      name,
    }
  },
  allIds: [],
}

comments: {
  isFetching,
  error,
  byId: {
    [id]: {
      parent,
      timestamp,
      body,
      author,
      voteScore,
    }
  },
  allIds: [],
}
```

While we're at it, let's also think about our actions.

In a general sense, this is what our application can do:
- Log in
- Log out
- Add a Post with category and author
- Up- / Downvote a Post
- Edit a Post
- Delete a Post
- Add a Comment to a Post
- Up- / Downvote a Comment
- Edit a Comment
- Delete a Comment
- Sort posts by date / score
- Sort comments by date / score

Let's try to figure out our preliminary redux actions from our schema and the list above. There are still many things left to consider, but it doesn't hurt to plan too early.

```
// Users

{
  type: USER_AUTH,
  uid,
}

{
  type: USER_UNAUTH,
}

{
  type: USER_FETCHING,
}

{
  type: USER_FETCHING_ERROR,
  error,
}

{
  type: USER_FETCHING_SUCCESS,
  error,
}

// Categories

{
  type: CATEGORIES_FETCHING,
}

{
  type: CATEGORIES_FETCHING_ERROR,
  error,
}

{
  type: CATEGORIES_FETCHING_SUCCESS,
  categories,
}

// Posts

{
  type: POST_ADD,
  post,
}

{
  type: POST_FETCHING,
}

{
  type: POST_FETCHING_ERROR,
  error,
}

{
  type: POST_FETCHING_SUCCESS,
  posts,
}

{
  type: POST_FETCHING_CANCEL,
}

{
  type: POST_EDIT,
}

{
  type: POST_REMOVE,
}

{
  type: POST_VOTE_UP,
}

{
  type: POST_VOTE_DOWN,
}

// Comments

{
  type: COMMENT_ADD,
  comment,
}

{
  type: COMMENT_FETCHING,
}

{
  type: COMMENT_FETCHING_ERROR,
  error,
}

{
  type: COMMENT_FETCHING_SUCCESS,
  comments,
}

{
  type: COMMENT_FETCHING_CANCEL,
}

{
  type: COMMENT_EDIT,
}

{
  type: COMMENT_REMOVE,
}

{
  type: COMMENT_VOTE_UP,
}

{
  type: COMMENT_VOTE_DOWN,
}

// UI

{
  type: SORT_POSTS_BY_DATE,
}

{
  type: SORT_POSTS_BY_SCORE,
}

{
  type: SORT_COMMENS_BY_DATE,
}

{
  type: SORT_COMMENS_BY_SCORE,
}

// I want to edit my comments inline, so I need to keep track of that
{
  type: EDIT_COMMENT_BEGIN,
  id,
}

{
  type: EDIT_COMMENT_END,
}


```

There are many design decisions to think about here, but it will all make more sense when we build out our application.

### Install redux and router
Now we set up our react frontend for greatness. First, we need some additional packages.

```
cd frontend
npm i -S prop-types redux react-redux redux-thunk react-router-dom
```

Next let's create our directory structure.
```
mkdir -p src/{redux/modules,store,containers,components}
```

There are just a few changes I want to make before we get down to our actions and reducers. To facilitate the import of modules let's add the `src` directory to our `NODE_PATH`. That allows us to use absolute paths for our imports.
```
[frontend/.env]

NODE_PATH=src/
```

We are also going to delete all the files from the boilerplate we won't need.
```
rm src/{App.css,App.js,App.test.js}
```

Ok, finally let's go ahead and write our users reducer.
```
[frontend/src/redux/modules/users.js]

import uniq from 'lodash';

const USER_AUTH = `USER_AUTH`;
const USER_UNAUTH = `USER_UNAUTH`;
const USER_FETCHING = `USER_FETCHING`;
const USER_FETCHING_ERROR = `USER_FETCHING_ERROR`;
const USER_FETCHING_SUCCESS = `USER_FETCHING_SUCCESS`;

function userAuth(uid) {
  return {
    type: USER_AUTH,
    uid
  };
}

function userUnauth() {
  return {
    type: USER_UNAUTH
  };
}

function userFetching() {
  return {
    type: USER_FETCHING
  };
}

function userFetchingError(error) {
  return {
    type: USER_FETCHING_ERROR,
    error
  };
}

function userFetchingSuccess(user) {
  return {
    type: USER_FETCHING_SUCCESS,
    user
  };
}

const initialState = {
  isFetching: true,
  error: '',
  isAuthed: false,
  authedId: '',
  byId: {},
  allIds: []
};

export default function users(state = initialState, action) {
  switch (action.type) {
    case USER_AUTH:
      return {
        ...state,
        isAuthed: true,
        authedId: action.uid
      };
    case USER_UNAUTH:
      return {
        ...state,
        isAuthed: false,
        authedId: ''
      };
    case USER_FETCHING:
      return {
        ...state,
        isFetching: true
      };
    case USER_FETCHING_ERROR:
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case USER_FETCHING_SUCCESS:
      return {
        ...state,
        isFetching: false,
        byId: byId(state.byId, action),
        allIds: allIds(state.allIds, action)
      };
    default:
      return state;
  }
}

function byId(state, action) {
  switch (action.type) {
    case USER_FETCHING_SUCCESS:
      console.log(action);
      return {
        ...state,
        ...action.payload.entities.users
      };
    default:
      return state;
  }
}

function allIds(state, action) {
  switch (action.type) {
    case USER_FETCHING_SUCCESS:
      return uniq([...state, ...Object.keys(action.payload.entities.users)]);
    default:
      return state;
  }
}
```

All the actions and reducers are going to exist together in the `modules` folder. To create our store however, we need a single root reducer. I want to construct our root reducer within the `modules` folder and we can do so conveniently by creating an `index.js` file.

```
[frontend/src/redux/modules/index.js]

import { combineReducers } from 'redux';
import users from './users';

const rootReducer = combineReducers({
  users
});

export default rootReducer;
```
We just have to make sure we update this file every time we add a new reducer.


Now that we have a basic reducer up and going, we can create our store. To keep everything neet and organized, let's do it in a separate file.
```
[frontend/store/createStore.js]

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from 'redux/modules';

const enhancers = [
  applyMiddleware(thunk),
  // Apply dev-tools middleware if present
  window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : f => f
];

const configureStore = () => {
  return createStore(rootReducer, compose(...enhancers));
};

export default configureStore;
```

We will use that function in our project's `index.js` file.
```
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Root from 'containers/Root';
import configureStore from 'store/configureStore';

const store = configureStore();

render(
  <Router>
    <Root store={store} />
  </Router>,
  document.getElementById('root')
);
```
We pass the newly create store to our `Root` component, and wrap it in a `Router`.


We will create a new folder for our `Root` container.
```
[frontend/src/containers/Root/RootContainer.js]

import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

const RootContainer = ({ store }) => (
  <Provider store={store}>
    <div className="app">
      <h1>Readable</h1>
    </div>
  </Provider>
);

RootContainer.propTypes = {
  store: PropTypes.object.isRequired
};

export default RootContainer;
```
Creating a new folder for all components seems unnecessary at the moment, but it starts to make sense once we add CSS to some of them. To keep the import path simple, let's use our `index.js` trick again.
```
[frontend/src/containers/Root/index.js]

export { default } from './RootContainer';
```