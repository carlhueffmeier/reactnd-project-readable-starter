// Checks whether the user is allowed to edit the post.
// Otherwise redirects to landing page.

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { UserType, PostType } from 'types';
import { getCurrentUser } from 'redux/modules/users';
import Spinner from 'components/Spinner';
import { Redirect } from 'react-router-dom';

CheckPostEditRightsContainer.propTypes = {
  isAuthed: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  currentUser: UserType,
  children: PropTypes.object.isRequired,
  post: PostType.isRequired
};

function CheckPostEditRightsContainer({
  isAuthed,
  isFetching,
  currentUser,
  post,
  children
}) {
  if (isFetching) {
    return <Spinner />;
  }
  if (!isAuthed || currentUser.uid !== post.author.uid) {
    return <Redirect to="/" />;
  }

  return children;
}

function mapStateToProps(state) {
  return {
    isAuthed: state.entities.users.isAuthed,
    isFetching: state.entities.users.isFetching,
    currentUser: getCurrentUser(state)
  };
}

export default connect(mapStateToProps)(CheckPostEditRightsContainer);
