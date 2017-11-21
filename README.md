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
[frontend/src/index.js]

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Root from 'containers/Root';
import configureStore from 'store/configureStore';
import './index.css'

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

Et voila, we have our first output.

### Authentication Part 1: Fake Authentication
Alright, with redux and router set up, let's start with the most difficult part of the application: Authentication.

There is one step I want to do in preparation for that, let's quickly set up our normalization schema. When we begin to process data from our server, we want to get all necessary information at once, so we don't have to query multiple times. For example getting the post with an user id as author is pretty unpractical if we have to query the server for the user's display name for every post we display. That's why most APIs will give us everything we need in one big object and untangling it can be quite laboursome. That is where `normalizr` comes in. It takes a complex object and splits it up into the individual "entities". For example posts and users. We can then add the user to our redux store and don't have to bother our API again. Ok, so let's install it.
```
cd frontend
npm i -S normalizr
```
To teach normalizr how to untangle our server responses, we need to set up a schema.
```
[frontend/src/schema/index.js]

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
```

Using our schema, we can now use the `normalize` function to process our API responses. Let's modify our users module accordingly and add a `fakeAuth` function.

```
[frontend/src/redux/modules/users.js]

import uniq from 'lodash';
import { normalize } from 'normalizr';
import { userSchema } from 'schema';

const USER_AUTH = `USER_AUTH`;
const USER_UNAUTH = `USER_UNAUTH`;
const USER_FETCHING = `USER_FETCHING`;
const USER_FETCHING_ERROR = `USER_FETCHING_ERROR`;
const USER_FETCHING_DISMISS_ERROR = `USER_FETCHING_DISMISS_ERROR`;
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

export function userFetchingDismissError() {
  return {
    type: USER_FETCHING_DISMISS_ERROR
  };
}

function userFetchingSuccess(payload) {
  return {
    type: USER_FETCHING_SUCCESS,
    payload
  };
}

function fakeAuth(username, password) {
  return new Promise((resolve, reject) => {
    console.log(`logging in ${username} (${password})`);
    const result = {
      uid: 1,
      name: username
    };
    setTimeout(() => resolve({ data: result }), 2000);
  });
}

export function localLogin(username, password) {
  return dispatch => {
    dispatch(userFetching());
    return new Promise(resolve => {
      fakeAuth(username, password)
        .then(res => {
          const normalizedData = normalize(res.data, userSchema);
          dispatch(userFetchingSuccess(normalizedData));
          dispatch(userAuth(res.data.uid));
          resolve();
        })
        .catch(error => dispatch(userFetchingError(error)));
    });
  };
}

const initialState = {
  isFetching: false,
  error: ``,
  isAuthed: false,
  authedId: ``,
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
        authedId: ``
      };
    case USER_FETCHING:
      return {
        ...state,
        isFetching: true,
        error: ``
      };
    case USER_FETCHING_ERROR:
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case USER_FETCHING_DISMISS_ERROR:
      return {
        ...state,
        error: ``
      };
    case USER_FETCHING_SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: ``,
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

Ok, next to the UI. I want to use a modal that asks for login information and displays a "Sign in with Google" button. We will use the package `react-modal`, so let's install it.

```
cd frontend
npm i -S react-modal
```

We will split the login into a container and a component.

```
[frontend/src/containers/Login/LoginContainer.js]

import { connect } from 'react-redux';
import Login from 'components/Login';
import * as modalActions from 'redux/modules/modal';
import { localLogin, userFetchingDismissError } from 'redux/modules/users';

function mapStateToProps({ modal, users }, props) {
  return {
    username: modal.username,
    password: modal.password,
    error: users.error,
    isOpen: modal.isOpen,
    isFetching: users.isFetching,
    isSubmitDisabled:
      modal.username.length === 0 ||
      modal.password.length === 0 ||
      users.isFetching
  };
}

export default connect(mapStateToProps, {
  ...modalActions,
  localLogin,
  userFetchingDismissError
})(Login);
```

As before, we create a new folder and add an `index.js` for easier import.

As you can see there are a few things we have to write in order for this to work.
First let's build the modal module.

```
[frontend/src/redux/modules/modal.js]

const MODAL_OPEN = `MODAL_OPEN`;
const MODAL_CLOSE = `MODAL_CLOSE`;
const MODAL_UPDATE_USERNAME = `MODAL_UPDATE_USERNAME`;
const MODAL_UPDATE_PASSWORD = `MODAL_UPDATE_PASSWORD`;

export function modalOpen() {
  return {
    type: MODAL_OPEN
  };
}

export function modalClose() {
  return {
    type: MODAL_CLOSE
  };
}

export function modalUpdateUsername(username) {
  return {
    type: MODAL_UPDATE_USERNAME,
    username
  };
}

export function modalUpdatePassword(password) {
  return {
    type: MODAL_UPDATE_PASSWORD,
    password
  };
}

const initialState = {
  username: '',
  password: '',
  isOpen: false
};

export default function modal(state = initialState, action) {
  switch (action.type) {
    case MODAL_OPEN:
      return {
        ...state,
        isOpen: true
      };
    case MODAL_CLOSE:
      return {
        username: '',
        password: '',
        isOpen: false
      };
    case MODAL_UPDATE_USERNAME:
      return {
        ...state,
        username: action.username
      };
    case MODAL_UPDATE_PASSWORD:
      return {
        ...state,
        password: action.password
      };
    default:
      return state;
  }
}
```

Ok, that should work. Next let's build out our component.

```
[frontend/src/components/Login/Login.js]

import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import Spinner from 'components/Spinner';
import './styles.css';

const modalStyles = {
  content: {
    width: 350,
    margin: '0px auto',
    height: 300,
    borderRadius: 5,
    background: '#EBEBEB',
    padding: 0
  }
};

Login.propTypes = {
  modalOpen: PropTypes.func.isRequired,
  modalClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isSubmitDisabled: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  modalUpdateUsername: PropTypes.func.isRequired,
  modalUpdatePassword: PropTypes.func.isRequired,
  localLogin: PropTypes.func.isRequired
};

export default function Login(props) {
  function onSubmit(event) {
    event.preventDefault();
    const { localLogin, username, password } = props;
    localLogin(username, password).then(() => props.modalClose());
  }

  function onClose(event) {
    props.userFetchingDismissError();
    props.modalClose();
  }

  return (
    <div>
      <button className="btn btn-primary login-btn" onClick={props.modalOpen}>
        Login
      </button>
      <ReactModal
        style={modalStyles}
        isOpen={props.isOpen}
        onRequestClose={onClose}
      >
        <div>
          <button onClick={onClose} className="login-modal-close-btn">
            ×
          </button>
        </div>
        <form className="login-modal-form" onSubmit={onSubmit}>
          <input
            onChange={e => props.modalUpdateUsername(e.target.value)}
            value={props.username}
            maxLength={140}
            type="text"
            className="login-modal-input"
            placeholder="Username"
          />
          <input
            onChange={e => props.modalUpdatePassword(e.target.value)}
            value={props.password}
            maxLength={140}
            type="password"
            className="login-modal-input"
            placeholder="Password"
          />
          <span className="login-modal-error-text">{props.error}</span>
          <button
            className="btn btn-primary login-modal-submit-btn"
            disabled={props.isSubmitDisabled}
            type="submit"
          >
            {props.isFetching ? <Spinner size={30} color="white" /> : `Login`}
          </button>
          <a href="/auth/google">
            <div className="btn login-modal-login-with-google-btn">
              <span>Login with Google</span>
            </div>
          </a>
        </form>
      </ReactModal>
    </div>
  );
}
```

To give our buttons a uniform look, let's add general button styles to the `index.css`. We will also change the default font for our app here.

```
[frontend/src/index.css]

body {
  margin: 0;
  padding: 0;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
}

a {
  text-decoration: none;
}

/* Buttons */
.btn {
  text-transform: uppercase;
  font-size: 1rem;
  font-weight: 500;
  height: 2.6rem;
  padding: 0 2rem;
  border: 0;
  border-radius: 2px;
  background: rgba(158, 158, 158, 0.2);
  color: #000;
  cursor: pointer;
}

.btn:disabled {
  cursor: not-allowed;
  pointer-events: none;
  opacity: 0.6;
  box-shadow: none;
}

.btn:active,
.btn:focus {
  background: rgba(158, 158, 158, 0.4);
  outline: none;
}

.btn.btn-primary {
  background: #2196f3;
  color: #fff;
}

.btn.btn-primary:hover,
.btn.btn-primary:active,
.btn.btn-primary:focus {
  background: #39a1f4;
}
```

To load our new font, we will add this code to our `<head>` in the `index.html` file.
And while we have the file open, let's also change the title.

```
[frontend/public/index.html]

<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
```

And now to the `styles.css` for our `Login` component.

```
[frontend/src/component/Modal/styles.css]

.login-modal-close-btn {
  position: absolute;
  top: 0;
  right: 0;
  padding-left: 10px;
  padding-right: 10px;
  font-size: 2rem;
  cursor: pointer;
  background: transparent;
  border: none;
}

.login-modal-close-btn:active,
.login-modal-close-btn:focus {
  outline: none;
  background: transparent;
}

.login-modal-form {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 3rem 2rem;
}

.login-modal-input {
  margin-bottom: 1rem;
  padding: 10px;
  font-size: 1rem;
}

.login-modal-error-text {
  color: #f44336;
  height: 1rem;
}

.btn.login-modal-login-with-google-btn {
  background-color: #fff;
  border: none;
  color: #000;
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
```

See the Spinner component we imported in our `Login` component. Let's write that, with the help of the awesome SpinKit repository by Tobias Ahlin.

```
[frontend/src/components/Spinner/Spinner.js]

import React from 'react';
import './styles.css';

// Spinner from SpinKit by Tobias Ahlin
// https://github.com/tobiasahlin/SpinKit/blob/master/css/spinners/8-circle.css

export default function Spinner({ size = 40, color = `#333` }) {
  const styles = {
    width: size,
    height: size,
    color
  };
  return (
    <div className="sk-circle" style={styles}>
      <div className="sk-circle1 sk-child" />
      <div className="sk-circle2 sk-child" />
      <div className="sk-circle3 sk-child" />
      <div className="sk-circle4 sk-child" />
      <div className="sk-circle5 sk-child" />
      <div className="sk-circle6 sk-child" />
      <div className="sk-circle7 sk-child" />
      <div className="sk-circle8 sk-child" />
      <div className="sk-circle9 sk-child" />
      <div className="sk-circle10 sk-child" />
      <div className="sk-circle11 sk-child" />
      <div className="sk-circle12 sk-child" />
    </div>
  );
}
```

And the CSS file, only slightly modified from the Github page.

```
.sk-circle {
  display: inline-block;
  position: relative;
}
.sk-circle .sk-child {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.sk-circle .sk-child:before {
  content: '';
  display: block;
  margin: 0 auto;
  width: 15%;
  height: 15%;
  background-color: currentColor;
  border-radius: 100%;
  -webkit-animation: sk-circleBounceDelay 1.2s infinite ease-in-out both;
  animation: sk-circleBounceDelay 1.2s infinite ease-in-out both;
}
.sk-circle .sk-circle2 {
  -webkit-transform: rotate(30deg);
  -ms-transform: rotate(30deg);
  transform: rotate(30deg);
}
.sk-circle .sk-circle3 {
  -webkit-transform: rotate(60deg);
  -ms-transform: rotate(60deg);
  transform: rotate(60deg);
}
.sk-circle .sk-circle4 {
  -webkit-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  transform: rotate(90deg);
}
.sk-circle .sk-circle5 {
  -webkit-transform: rotate(120deg);
  -ms-transform: rotate(120deg);
  transform: rotate(120deg);
}
.sk-circle .sk-circle6 {
  -webkit-transform: rotate(150deg);
  -ms-transform: rotate(150deg);
  transform: rotate(150deg);
}
.sk-circle .sk-circle7 {
  -webkit-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  transform: rotate(180deg);
}
.sk-circle .sk-circle8 {
  -webkit-transform: rotate(210deg);
  -ms-transform: rotate(210deg);
  transform: rotate(210deg);
}
.sk-circle .sk-circle9 {
  -webkit-transform: rotate(240deg);
  -ms-transform: rotate(240deg);
  transform: rotate(240deg);
}
.sk-circle .sk-circle10 {
  -webkit-transform: rotate(270deg);
  -ms-transform: rotate(270deg);
  transform: rotate(270deg);
}
.sk-circle .sk-circle11 {
  -webkit-transform: rotate(300deg);
  -ms-transform: rotate(300deg);
  transform: rotate(300deg);
}
.sk-circle .sk-circle12 {
  -webkit-transform: rotate(330deg);
  -ms-transform: rotate(330deg);
  transform: rotate(330deg);
}
.sk-circle .sk-circle2:before {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}
.sk-circle .sk-circle3:before {
  -webkit-animation-delay: -1s;
  animation-delay: -1s;
}
.sk-circle .sk-circle4:before {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}
.sk-circle .sk-circle5:before {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}
.sk-circle .sk-circle6:before {
  -webkit-animation-delay: -0.7s;
  animation-delay: -0.7s;
}
.sk-circle .sk-circle7:before {
  -webkit-animation-delay: -0.6s;
  animation-delay: -0.6s;
}
.sk-circle .sk-circle8:before {
  -webkit-animation-delay: -0.5s;
  animation-delay: -0.5s;
}
.sk-circle .sk-circle9:before {
  -webkit-animation-delay: -0.4s;
  animation-delay: -0.4s;
}
.sk-circle .sk-circle10:before {
  -webkit-animation-delay: -0.3s;
  animation-delay: -0.3s;
}
.sk-circle .sk-circle11:before {
  -webkit-animation-delay: -0.2s;
  animation-delay: -0.2s;
}
.sk-circle .sk-circle12:before {
  -webkit-animation-delay: -0.1s;
  animation-delay: -0.1s;
}

@-webkit-keyframes sk-circleBounceDelay {
  0%,
  80%,
  100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  40% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}

@keyframes sk-circleBounceDelay {
  0%,
  80%,
  100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  40% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
```

Don't forget to add `index.js` as usual.


Ok, with everything in place let's try adding it to our `Root` container for now.

```
[frontend/src/containers/Root/Root.js]

import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import Login from 'containers/Login';

const RootContainer = ({ store }) => (
  <Provider store={store}>
    <div className="app">
      <h1>Readable</h1>
      <Login />
    </div>
  </Provider>
);

RootContainer.propTypes = {
  store: PropTypes.object.isRequired
};

export default RootContainer;
```

Seems to work.
Changing the `fakeAuth` function to throw an error also gives us feedback, great!

```
[frontend/src/redux/modules/users.js]

function fakeAuth(username, password) {
  return new Promise((resolve, reject) => {
    console.log(`logging in ${username} (${password})`);
    const result = {
      uid: 1,
      name: username
    };
    // setTimeout(() => resolve({ data: result }), 2000);
    setTimeout(() => reject(`Bad, baaaaad error. I can't handle this..`), 2000);
  });
}
```

### Authentication Part 2: Backend
Let's leave our react application for a moment and look at how we can do authentication on our backend.
Before we begin adding functionality, I want to structure the code a little bit.

```
cd api-server
mkdir routes services config
mv categories.js comments.js posts.js services
mv config.js config
touch routes/{root.js,categories.js,comments.js,posts.js}
```

While we are in the terminal, let's also install all the necessary packages. Actually `morgan` is optional, it is just a logging tool giving us some feedback while we are testing our server.

```
npm i -S cookie-session passport passport-google-oauth20 passport-local morgan
```
Let's extract the routes from `server.js`. We just have to cut & paste the routes into the respective files and wrap it in a function taking `app` as argument. We also need to require the necessary services and update all `require` statements to the new paths.

After doing that our routes will look something like this.

```
[api-server/routes/categories.js]

const categories = require('../services/categories');
const posts = require('../services/posts');

module.exports = app => {
  app.get('/categories', (req, res) => {
    categories.getAll(req.token).then(
      data => res.send(data),
      error => {
        console.error(error);
        res.status(500).send({
          error: 'There was an error.'
        });
      }
    );
  });

  app.get('/:category/posts', (req, res) => {
    posts.getByCategory(req.token, req.params.category).then(
      data => res.send(data),
      error => {
        console.error(error);
        res.status(500).send({
          error: 'There was an error.'
        });
      }
    );
  });
};
```

And our `server.js` will be clean and simple.

```
[api-server/server.js]

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/config');

const app = express();

app.use(express.static('public'));
app.use(cors());
app.use(morgan('dev'));

require('./routes/root')(app);
require('./routes/categories')(app);
require('./routes/posts')(app);
require('./routes/comments')(app);

app.listen(config.port, () => {
  console.log('Server listening on port %s, Ctrl+C to stop', config.port);
});
```

I want my authentication endpoints separate from my api endpoints. So let's change the routes to reflect that.

```
[api-server/routes/categories.js]

const categories = require('../services/categories');
const posts = require('../services/posts');

module.exports = app => {
  app.get('/api/categories', (req, res) => {
    categories.getAll(req.token).then(
      data => res.send(data),
      error => {
        console.error(error);
        res.status(500).send({
          error: 'There was an error.'
        });
      }
    );
  });

  app.get('/api/:category/posts', (req, res) => {
    posts.getByCategory(req.token, req.params.category).then(
      data => res.send(data),
      error => {
        console.error(error);
        res.status(500).send({
          error: 'There was an error.'
        });
      }
    );
  });
};
```

Next, let's sign up for Google OAuth (or the Google+ API as it is called in the developer console). I will save my client id and secret in a separate `keys.js` file. That way I can add it to my `.gitignore` to keep it secret.

```
[api-server/config/keys.js]

module.exports = {
  googleClientID:
    'notsosecretclientid',
  googleClientSecret: 'supersecret',
  cookieKey: 'alsosecret'
};
```
```
[.gitignore]

node_modules/
.DS_Store
api-server/config/keys.js
```

Before we set up passport and the `auth` route, we need a way to store our user data. Normally we would use a database like mongodb for that, but I want to keep the requirements to run the application minimal. That is why we will store it non-persistent in a simple Javascript object.

The structure will be similar to the other services, but we won't use the authentication header to keep separate databases. That would make the OAuth flow even more complicated than it already is.

```
[api-server/services/users.js]

const userData = {
  mulder: {
    uid: 'mulder',
    displayName: 'Fox Mulder'
  },
  '123': {
    uid: '123',
    displayName: 'thingtwo'
  },
  '124': {
    uid: '124',
    displayName: 'thingone'
  }
};

const passwords = {
  mulder: 'trustno1'
};

const getAll = () => new Promise(res => res(userData));

const get = uid => new Promise(res => res(userData[uid] || null));

const add = user =>
  new Promise(res => {
    userData[user.uid] = {
      uid: user.uid,
      displayName: user.displayName
    };
    res(userData[user.uid]);
  });

const populateAuthor = item => ({
  ...item,
  author: userData[item.author] || null
});

const verifyPassword = (user, password) => passwords[user.uid] === password;

module.exports = {
  getAll,
  get,
  add,
  populateAuthor,
  verifyPassword
};
```

Ok, next our passport service

```
[api-server/services/passport.js]

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const keys = require('../config/keys');
const users = require('./users');

passport.serializeUser((user, done) => {
  console.log('serialize ', user);
  done(null, user.uid);
});

passport.deserializeUser(async (uid, done) => {
  console.log('deserialize ', uid);
  const user = await users.get(uid);
  done(null, user);
});

const getPrimaryEmail = profile => {
  const primary = profile.emails.find(email => email.type === 'account');
  return primary ? primary.value : null;
};

passport.use(
  new GoogleStrategy(
    {
      clientSecret: keys.googleClientSecret,
      clientID: keys.googleClientID,
      callbackURL: '/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await users.get(profile.id);
      if (existingUser) {
        done(null, existingUser);
      } else {
        const newUser = await users.add({
          uid: profile.id,
          displayName: profile.displayName
        });
        done(null, newUser);
      }
    }
  )
);

passport.use(
  new LocalStrategy(async (username, password, done) => {
    const user = await users.get(username);
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (!users.verifyPassword(user, password)) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  })
);
```

Ok, let's put it all together in the `server.js` file.

```
[api-server/server.js]

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieSession = require('cookie-session');
const passport = require('passport');
const config = require('./config/config');
const keys = require('./config/keys');
require('./services/passport.js');

const app = express();

app.use(express.static('public'));
app.use(cors());
app.use(morgan('dev'));
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in miliseconds
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());

require('./routes/auth')(app);
require('./routes/root')(app);
require('./routes/categories')(app);
require('./routes/posts')(app);
require('./routes/comments')(app);

app.listen(config.port, () => {
  console.log('Server listening on port %s, Ctrl+C to stop', config.port);
});
```

That should do it!

Before we go on to the next section, let's try it out. To access the api server from our react application, it is convenient to configure proxy in the `package.json` of our frontend.

```
[frontend/package.json]

  ...
  "private": true,
  "proxy": {
    "/auth": {
      "target": "http://localhost:5000"
    },
    "/api": {
      "target": "http://localhost:5000"
    }
  },
  ...
```

Please note: I changed the port to 5000, use whatever port your express server is running on. We need to restart our development server for the changes to take effect.

Because we already set up the link correctly in our login modal, let's click on "Login with Google". We are successfully redirected to the Google Sign-in page! We can also verify whether the login info is correctly stored in our session by navigating to `http://localhost:3000/api/current_user`. This should return an object with `uid` and `displayName`.


### Authentication Part 3: Talking to our backend
To make api requests, we will use the package `axios`.

```
cd frontend
npm i -S axios
```

We will then replace the `fakeAuth` function inside our users module.

```
[frontend/src/redux/modules/users.js]

export function localLogin(username, password) {
  return dispatch => {
    dispatch(userFetching());
    return new Promise(resolve => {
      axios
        .post(`/auth/local`, { username, password })
        .then(res => {
          const normalizedData = normalize(res.data, userSchema);
          dispatch(userFetchingSuccess(normalizedData));
          dispatch(userAuth(res.data.uid));
          resolve();
        })
        .catch(error =>
          dispatch(userFetchingError(`Error during authentication.`))
        );
    });
  };
}
```

We also need a function to fetch the current user, thereby checking whether we are logged in or not. And a function to log the user out.

```
[frontend/src/redux/modules/users.js]

export function fetchCurrentUser() {
  return dispatch => {
    dispatch(userFetching());
    axios
      .get(`/api/current_user`)
      .then(res => {
        if (res.data.uid) {
          const normalizedData = normalize(res.data, userSchema);
          dispatch(userFetchingSuccess(normalizedData));
          dispatch(userAuth(res.data.uid));
        } else {
          dispatch(userUnauth());
        }
      })
      .catch(() =>
        dispatch(userFetchingError(`Error while fetching current user.`))
      );
  };
}

export function logout() {
  return dispatch => {
    axios
      .get(`/api/logout`)
      .then(() => dispatch(userUnauth()))
      .catch(() => console.warn(`Error during logout.`));
  };
}
```

Now where would we call the `fetchCurrentUser` function? We wouldn't want to check whether the user is logged in on every page change.

It is not ideal, but it would make sense to fetch the current user inside the Navigation Bar, that way `componentDidMount` will only be called when the user enters the site.

Let's encapsulate the whole sign in / out functionality into one component. The outermost container just fetches the current user and thereby checks sign-in status.

```
[frontend/src/containers/Authentication/AuthenticationContainer.js]

import React, { Component } from 'react';
import { connect } from 'react-redux';
import SignInAndOutButton from 'components/SignInAndOutButton';
import { fetchCurrentUser } from 'redux/modules/users';

class AuthenticationContainer extends Component {
  componentDidMount() {
    this.props.fetchCurrentUser();
  }

  render() {
    return <SignInAndOutButton />;
  }
}

export default connect(null, { fetchCurrentUser })(AuthenticationContainer);
```

Then we have the `SignInAndOutButton` component which just displays a "Sign In" button when we are logged out and a "Sign Out" button when we are signed in.

```
[frontend/src/components/SignInAndOutButton/SignInAndOutButton.js]

import React from 'react';
import { connect } from 'react-redux';
import SignInButton from 'containers/SignInButton';
import SignOutButton from 'components/SignOutButton';
import SpinningButton from 'components/SpinningButton';

function SignInAndOutButton({ isAuthed, isFetching }) {
  if (isFetching) {
    return <SpinningButton className="btn btn-sm" />;
  } else {
    return isAuthed ? (
      <SignOutButton className="btn btn-sm" />
    ) : (
      <SignInButton className="btn btn-sm btn-primary" />
    );
  }
}

function mapStateToProps({ users }) {
  return {
    isAuthed: users.isAuthed,
    isFetching: users.isFetching
  };
}

export default connect(mapStateToProps)(SignInAndOutButton);
```

As you can see, I did not split the component into container and component. In this case I found it easier to keep everything in one file. We can always refactor later if the need arises.

```
[frontend/src/containers/SignInButton/SignInButtonContainer.js]

import { connect } from 'react-redux';
import SignInButton from 'components/SignInButton';
import * as modalActions from 'redux/modules/modal';
import { localLogin, userFetchingDismissError } from 'redux/modules/users';

function mapStateToProps({ modal, users }, props) {
  return {
    username: modal.username,
    password: modal.password,
    error: users.error,
    isOpen: modal.isOpen,
    isFetching: users.isFetching,
    isSubmitDisabled:
      modal.username.length === 0 ||
      modal.password.length === 0 ||
      users.isFetching,
    buttonProps: props
  };
}

export default connect(mapStateToProps, {
  ...modalActions,
  localLogin,
  userFetchingDismissError
})(SignInButton);
```

```
[frontend/src/components/SignInButton/SignInButton.js]

import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import Spinner from 'components/Spinner';
import './styles.css';

const modalStyles = {
  content: {
    width: 350,
    margin: '0px auto',
    height: 300,
    borderRadius: 5,
    background: '#EBEBEB',
    padding: 0
  }
};

SignInButton.propTypes = {
  modalOpen: PropTypes.func.isRequired,
  modalClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isSubmitDisabled: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  modalUpdateUsername: PropTypes.func.isRequired,
  modalUpdatePassword: PropTypes.func.isRequired,
  localLogin: PropTypes.func.isRequired,
  buttonProps: PropTypes.object
};

export default function SignInButton(props) {
  function onSubmit(event) {
    event.preventDefault();
    const { localLogin, username, password } = props;
    localLogin(username, password).then(() => props.modalClose());
  }

  function onClose(event) {
    props.userFetchingDismissError();
    props.modalClose();
  }

  return (
    <div>
      <button {...props.buttonProps} onClick={props.modalOpen}>
        Sign in
      </button>
      <ReactModal
        style={modalStyles}
        isOpen={props.isOpen}
        onRequestClose={onClose}
      >
        <div>
          <button onClick={onClose} className="login-modal-close-btn">
            ×
          </button>
        </div>
        <form className="login-modal-form" onSubmit={onSubmit}>
          <input
            onChange={e => props.modalUpdateUsername(e.target.value)}
            value={props.username}
            maxLength={140}
            type="text"
            className="login-modal-input"
            placeholder="Username"
          />
          <input
            onChange={e => props.modalUpdatePassword(e.target.value)}
            value={props.password}
            maxLength={140}
            type="password"
            className="login-modal-input"
            placeholder="Password"
          />
          <span className="login-modal-error-text">{props.error}</span>
          <button
            className="btn btn-primary login-modal-submit-btn"
            disabled={props.isSubmitDisabled}
            type="submit"
          >
            {props.isFetching ? <Spinner size={30} color="white" /> : `Sign In`}
          </button>
          <a href="/auth/google">
            <div className="btn login-modal-login-with-google-btn">
              <span>Sign in with Google</span>
            </div>
          </a>
        </form>
      </ReactModal>
    </div>
  );
}
```

The `SignInButton` component is a little bit long. Let's try to extract the form. I am not completely happy with the form, modal and button being entangled like that. Will revisit later.

Also the logout button.

```
[frontend/src/components/SignOutButton/SignOutButton.js]

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logout } from 'redux/modules/users';

function SignOutButton({ logout, ...props }) {
  return (
    <button {...props} onClick={logout}>
      Sign out
    </button>
  );
}

SignOutButton.propTypes = {
  logout: PropTypes.func.isRequired
};

export default connect(null, { logout })(SignOutButton);
```

### List all posts

Our home route will display posts from all categories ordered by score or date. Let's build that.

These are the steps
- First we fix up our backend to return the data populated with author.
- We then implement data normalization using the `normalizr` library
- We also need a `posts` module to handle data from the backend
- To keep the code clean, we extract some utility functions for common use cases like "Send request and normalize response"
- In order to create our post list we create the following containers: `AllPosts`, `PostActionBar`, `PostVoteScore`
- And these components: `PostList`, `PostSummary`, `Post`, `VoteScore`, `ActionBar`

### Create new posts

- We will use redux-form
- Need to add it to the reducer
- Create new route
- Add `PostNew` container holding a PostForm
- We will split `PostForm` into container and component
I tried being fuzzy about this in the beginning, but separating the business logic keeps everything a lot cleaner.
- We also need a container `AuthorizedOnly` that checks whether the user is authenticated or not
- Refactor a lot
- Add some styles

### Sorting

- Create new module `ui` holding sort order for posts and the (soon to be implemented) comments
- Add a `SortOrderControls` component and a container that binds the right functions for posts
- Add the controls to `PostList`
- We sort the posts in a container for `PostList`

### Editing posts
### Showing comments
### Creating comments
### Editing comments