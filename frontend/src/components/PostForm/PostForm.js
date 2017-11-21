import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { MdClear, MdUndo } from 'react-icons/lib/md';
import './styles.css';

PostForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default function PostForm({
  handleSubmit,
  pristine,
  reset,
  submitting,
  initialValues
}) {
  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <ul className="post-form-outer">
        <Field
          name="title"
          component={renderInputField}
          type="text"
          label="Title"
        />
        <Field
          name="category"
          component={renderInputField}
          type="text"
          label="Category"
        />
        <Field
          name="body"
          component={renderTextField}
          rows="8"
          label="Content"
        />
        <li className="post-form-button-row">
          <button
            className="post-form-button btn btn-primary"
            type="submit"
            disabled={pristine || submitting}
          >
            {initialValues ? <span>Save</span> : <span>Post</span>}
          </button>
          <button
            className="post-form-button btn"
            type="reset"
            disabled={pristine || submitting}
            onClick={reset}
          >
            {initialValues ? (
              <span>
                <MdUndo size={18} />Undo Changes
              </span>
            ) : (
              <span>
                <MdClear size={18} /> Clear
              </span>
            )}
          </button>
        </li>
      </ul>
    </form>
  );
}

function renderInputField({
  input,
  label,
  type,
  meta: { touched, error, warning }
}) {
  return (
    <li>
      <label className="post-form-label">{label}</label>
      <div className="post-form-input-container">
        <input
          className="post-form-input"
          {...input}
          placeholder={label}
          type={type}
        />
        {touched &&
          ((error && <span className="form-error">{error}</span>) ||
            (warning && <span className="form-warning">{warning}</span>))}
      </div>
    </li>
  );
}

function renderTextField({
  input,
  label,
  rows,
  meta: { touched, error, warning }
}) {
  return (
    <li className="post-form-body">
      <label className="post-form-label">{label}</label>
      <div className="post-form-textarea-container">
        <textarea
          className="post-form-textarea"
          {...input}
          placeholder={label}
          rows={rows}
        />
        {touched &&
          ((error && <span className="form-error">{error}</span>) ||
            (warning && <span className="form-warning">{warning}</span>))}
      </div>
    </li>
  );
}
