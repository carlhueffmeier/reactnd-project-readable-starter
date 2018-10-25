// Shows a sortable list of comments

import React from 'react';
import PropTypes from 'prop-types';
import { CommentType } from 'types';
import CommentSortControls from 'containers/CommentSortControls';
import Comment from 'containers/Comment';
import './styles.css';

CommentList.propTypes = {
  comments: PropTypes.arrayOf(CommentType).isRequired,
};

export default function CommentList(props) {
  const { comments } = props;
  return (
    <div>
      <CommentSortControls />
      <ul className="comment-list">
        {comments.map(comment => (
          <li key={comment.id}>
            <Comment comment={comment} />
          </li>
        ))}
      </ul>
    </div>
  );
}
