// Checks whether the comment is being edited right now
// and renders a editable or non-editable comment respectfully

import React from 'react';
import { connect } from 'react-redux';
import CommentEditable from 'containers/CommentEditable';
import CommentNotEditable from 'components/CommentNotEditable';

function CommentContainer({ isEditable, ...props }) {
  if (isEditable) {
    return <CommentEditable {...props} />;
  } else {
    return <CommentNotEditable {...props} />;
  }
}

function mapStateToProps({ ui }, { comment }) {
  return {
    isEditable: ui.commentEditing === comment.id
  };
}

export default connect(mapStateToProps)(CommentContainer);
