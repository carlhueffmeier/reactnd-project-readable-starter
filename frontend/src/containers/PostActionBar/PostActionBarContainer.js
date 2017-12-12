// Shows all possible action of the user for the post.
// At the moment, it only shows the modify and delete actions
// for the author.

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import ActionBar from 'components/ActionBar';
import ActionBarButton from 'components/ActionBarButton';
import { deletePost } from 'redux/modules/posts';
import { isUserAllowedToModifyPost } from 'redux/modules/users';

PostActionBar.propTypes = {
  postId: PropTypes.string.isRequired,
  showModifyActions: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  deletePost: PropTypes.func.isRequired
};

function PostActionBar({ postId, showModifyActions, history, deletePost }) {
  return (
    <ActionBar>
      {showModifyActions && (
        <ActionBarButton onClick={() => history.push(`/edit/${postId}`)}>
          Edit
        </ActionBarButton>
      )}
      {showModifyActions && (
        <ActionBarButton onClick={() => deletePost(postId)}>
          Delete
        </ActionBarButton>
      )}
    </ActionBar>
  );
}

function mapStateToProps(state, { postId }) {
  return {
    showModifyActions: isUserAllowedToModifyPost(state, postId)
  };
}

export default withRouter(
  connect(mapStateToProps, { deletePost })(PostActionBar)
);
