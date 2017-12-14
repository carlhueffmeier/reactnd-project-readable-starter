// Our root components holds all routes

import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import Navigation from 'components/Navigation';
import AllPosts from 'containers/AllPosts';
import PostNew from 'containers/PostNew';
import PostEdit from 'containers/PostEdit';
import PostDetails from 'containers/PostDetails';
import CategoryList from 'containers/CategoryList';
import Category from 'containers/Category';
import FetchUser from 'containers/FetchUser';

RootContainer.propTypes = {
  store: PropTypes.object.isRequired
};

export default function RootContainer({ store }) {
  return (
    <Provider store={store}>
      <div className="app">
        <FetchUser />
        <Route path="/" component={Navigation} />
        <Route path="/" component={CategoryList} />
        <div className="content">
          <Switch>
            <Route exact path="/" component={AllPosts} />
            <Route exact path="/create" component={PostNew} />
            <Route exact path="/edit/:post_id" component={PostEdit} />
            <Route exact path="/:category" component={Category} />
            <Route exact path="/:category/:post_id" component={PostDetails} />
            <Redirect to="/" />
          </Switch>
        </div>
      </div>
    </Provider>
  );
}
