import React from 'react';
import PropTypes from 'prop-types';

SignOutButton.propTypes = {
  logout: PropTypes.func.isRequired,
};

export default function SignOutButton({ logout, ...buttonProps }) {
  return (
    <button {...buttonProps} onClick={logout}>
      Sign out
    </button>
  );
}
