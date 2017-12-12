// Very simple form to create new comments

import React from 'react';
import { Field } from 'redux-form';
import './styles.css';

export default function CommentNewForm(props) {
  const { handleSubmit, pristine, submitting } = props;
  return (
    <form className="comment-new" onSubmit={handleSubmit}>
      <Field
        className="comment-new-textarea"
        component="textarea"
        name="body"
        rows="5"
        placeholder="New Comment"
      />
      <button
        type="submit"
        className="btn btn-small btn-primary"
        disabled={pristine || submitting}
      >
        Post
      </button>
    </form>
  );
}
