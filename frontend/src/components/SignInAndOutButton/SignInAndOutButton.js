import React from 'react';
import PropTypes from 'prop-types';
import SignInButton from 'containers/SignInButton';
import SignOutButton from 'components/SignOutButton';
import SpinningButton from 'components/SpinningButton';

SignInAndOutButton.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  isAuthed: PropTypes.bool.isRequired
};
export default function SignInAndOutButton({ isAuthed, isFetching }) {
  if (isFetching) {
    return <SpinningButton className="btn btn-sm" />;
  } else {
    return isAuthed ? (
      <SignOutButton className="btn btn-sm" />
    ) : (
      <SignInButton className="btn btn-sm btn-primary" />
    );
  }
}
