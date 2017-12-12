import React from 'react';
import PropTypes from 'prop-types';
import { UserType } from 'types';
import CommentVoteScore from 'containers/CommentVoteScore';
import { formatTimestamp } from 'helpers/utils';
import './styles.css';

CommentWrapper.propTypes = {
  commentId: PropTypes.string.isRequired,
  author: UserType.isRequired,
  timestamp: PropTypes.number.isRequired
};

export default function CommentWrapper({
  commentId,
  author,
  timestamp,
  children
}) {
  return (
    <div className="comment-wrapper">
      <CommentVoteScore commentId={commentId} />
      <div className="comment">
        <CommentHeader author={author} timestamp={timestamp} />
        {children}
      </div>
    </div>
  );
}

function CommentHeader({ author, timestamp }) {
  return (
    <p className="comment-header">
      <strong>{author.displayName}</strong> {` - ${formatTimestamp(timestamp)}`}
    </p>
  );
}
