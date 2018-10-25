// Shows all possible action of the user for the comment.
// At the moment, it only shows the modify and delete actions
// for the author.

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ActionBar from 'components/ActionBar';
import ActionBarButton from 'components/ActionBarButton';
import { deleteComment } from 'redux/modules/comments';
import { beginEditingComment } from 'redux/modules/ui';
import { isUserAllowedToModifyComment } from 'redux/modules/users';

CommentActionBar.propTypes = {
  commentId: PropTypes.string.isRequired,
  showModifyActions: PropTypes.bool.isRequired,
  deleteComment: PropTypes.func.isRequired,
};

function CommentActionBar({
  commentId,
  showModifyActions,
  deleteComment,
  beginEditingComment,
}) {
  return (
    <ActionBar>
      {showModifyActions && (
        <ActionBarButton onClick={() => beginEditingComment(commentId)}>
          Edit
        </ActionBarButton>
      )}
      {showModifyActions && (
        <ActionBarButton onClick={() => deleteComment(commentId)}>
          Delete
        </ActionBarButton>
      )}
    </ActionBar>
  );
}

function mapStateToProps(state, { commentId }) {
  return {
    showModifyActions: isUserAllowedToModifyComment(state, commentId),
  };
}

export default connect(
  mapStateToProps,
  { deleteComment, beginEditingComment }
)(CommentActionBar);
