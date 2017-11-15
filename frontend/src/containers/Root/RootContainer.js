import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import Navigation from 'components/Navigation';

RootContainer.propTypes = {
  store: PropTypes.object.isRequired
};

export default function RootContainer({ store }) {
  return (
    <Provider store={store}>
      <div className="app">
        <Route path="/" component={Navigation} />
      </div>
    </Provider>
  );
}
