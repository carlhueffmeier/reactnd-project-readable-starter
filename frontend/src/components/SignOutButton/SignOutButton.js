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
