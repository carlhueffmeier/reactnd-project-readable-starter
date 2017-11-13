import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import Login from 'containers/Login';

RootContainer.propTypes = {
  store: PropTypes.object.isRequired
};

export default function RootContainer({ store }) {
  return (
    <Provider store={store}>
      <div className="app">
        <h1>Readable</h1>
        <Login />
      </div>
    </Provider>
  );
}
