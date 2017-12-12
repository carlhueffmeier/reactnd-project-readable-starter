// Button bar below posts and comments

import React from 'react';
import PropTypes from 'prop-types';
import './styles.css';

ActionBar.propTypes = {
  children: PropTypes.array.isRequired
};

export default function ActionBar({ children }) {
  return <footer className="action-bar">{children}</footer>;
}
