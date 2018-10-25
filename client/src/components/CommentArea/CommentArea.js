// Displays list of comments and "new comment" form

import React from 'react';
import PropTypes from 'prop-types';
import { CommentType } from 'types';
import CommentList from 'containers/CommentList';
import CommentNew from 'containers/CommentNew';
import './styles.css';

CommentArea.propTypes = {
  comments: PropTypes.arrayOf(CommentType).isRequired,
  postId: PropTypes.string.isRequired,
};

export default function CommentArea(props) {
  const { comments, postId } = props;
  return (
    <div className="comment-area">
      <h3 className="comment-area-title">Comments</h3>
      {comments.length > 0 ? (
        <CommentList comments={comments} />
      ) : (
        <span>No comments yet, be the first to comment!</span>
      )}
      <CommentNew postId={postId} />
    </div>
  );
}
