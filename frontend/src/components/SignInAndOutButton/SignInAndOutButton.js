import React from 'react';
import { connect } from 'react-redux';
import SignInButton from 'containers/SignInButton';
import SignOutButton from 'components/SignOutButton';
import SpinningButton from 'components/SpinningButton';

function SignInAndOutButton({ isAuthed, isFetching }) {
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

function mapStateToProps({ users }) {
  return {
    isAuthed: users.isAuthed,
    isFetching: users.isFetching
  };
}

export default connect(mapStateToProps)(SignInAndOutButton);
