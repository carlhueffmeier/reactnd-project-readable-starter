import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import Navigation from 'components/Navigation';
import AllPosts from 'containers/AllPosts';
import PostNew from 'containers/PostNew';
import PostDetails from 'containers/PostDetails';

RootContainer.propTypes = {
  store: PropTypes.object.isRequired
};

export default function RootContainer({ store }) {
  return (
    <Provider store={store}>
      <div className="app">
        <Route path="/" component={Navigation} />
        <div className="content">
          <Route exact path="/" component={AllPosts} />
          <Route exact path="/create" component={PostNew} />
          <Route exact path="/:category/:post_id" component={PostDetails} />
        </div>
      </div>
    </Provider>
  );
}
