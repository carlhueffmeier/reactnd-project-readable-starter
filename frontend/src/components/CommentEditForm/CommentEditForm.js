// Form used in `CommentEditable`

import React from 'react';
import { Field } from 'redux-form';
import MdCancel from 'react-icons/lib/md/cancel';
import './styles.css';

export default function CommentEditForm(props) {
  const { handleSubmit, pristine, submitting, onCancel } = props;
  return (
    <form className="comment-edit" onSubmit={handleSubmit}>
      <Field
        className="comment-edit-textarea"
        component="textarea"
        name="body"
        rows="3"
      />
      <div className="comment-edit-btn-row">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={pristine || submitting}
        >
          Save
        </button>
        <button type="button" className="btn" onClick={onCancel}>
          <MdCancel size="18" /> Cancel
        </button>
      </div>
    </form>
  );
}
