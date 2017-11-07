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
