import React from 'react';
import PropTypes from 'prop-types';
import SignInModal from 'containers/SignInModal';

SignInButton.propTypes = {
  modalOpen: PropTypes.func.isRequired
};

export default function SignInButton({ modalOpen, ...buttonProps }) {
  return (
    <div>
      <button {...buttonProps} onClick={modalOpen}>
        Sign in
      </button>
      <SignInModal />
    </div>
  );
}
