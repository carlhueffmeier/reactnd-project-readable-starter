// Shows a form populated with current comment text instead of comment body

import React from 'react';
import PropTypes from 'prop-types';
import { CommentType } from 'types';
import CommentWrapper from 'components/CommentWrapper';
import CommentEditForm from 'containers/CommentEditForm';

CommentEditable.propTypes = {
  comment: CommentType.isRequired,
  onSaveEdit: PropTypes.func.isRequired,
  onCancelEdit: PropTypes.func.isRequired,
};

export default function CommentEditable({ comment, onSaveEdit, onCancelEdit }) {
  const { id, timestamp, author, body } = comment;
  return (
    <CommentWrapper commentId={id} author={author} timestamp={timestamp}>
      <CommentEditForm
        form={`comment_${id}`}
        initialValues={{ body }}
        onSubmit={onSaveEdit}
        onCancel={onCancelEdit}
      />
    </CommentWrapper>
  );
}
