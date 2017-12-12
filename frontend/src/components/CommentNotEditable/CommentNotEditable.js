// Represents a comment in it's normal state (vs. CommentEditable)
// Displays the comment body and an action bar with all allowed actions for the comment

import React from 'react';
import { CommentType } from 'types';
import CommentWrapper from 'components/CommentWrapper';
import CommentActionBar from 'containers/CommentActionBar';
import { renderNewlines } from 'helpers/utils';
import './styles.css';

CommentNotEditable.propTypes = {
  comment: CommentType.isRequired
};

export default function CommentNotEditable({ comment }) {
  const { id, timestamp, author, body } = comment;
  return (
    <CommentWrapper commentId={id} author={author} timestamp={timestamp}>
      <CommentBody>{body}</CommentBody>
      <CommentActionBar commentId={id} />
    </CommentWrapper>
  );
}

function CommentBody({ children }) {
  return <p className="comment-body">{renderNewlines(children)}</p>;
}
