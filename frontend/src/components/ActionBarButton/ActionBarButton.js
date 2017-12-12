// Button for use with ActionBar

import React from 'react';
import PropTypes from 'prop-types';

ActionBarButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.string.isRequired
};

export default function ActionBarButton({ onClick, children }) {
  return (
    <button className="action-bar-button btn btn-xs" onClick={onClick}>
      {children}
    </button>
  );
}
