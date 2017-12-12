import React from 'react';
import { Field } from 'redux-form';
import { MdClear, MdUndo } from 'react-icons/lib/md';
import './styles.css';

export default function PostForm({
  handleSubmit,
  pristine,
  reset,
  submitting,
  initialValues,
  categories
}) {
  const isEditing = initialValues && initialValues.body;
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
          component={renderSelectField}
          options={createOptionsFromCategories(categories)}
          label="Category"
        />
        <Field
          name="body"
          component={renderTextField}
          rows="8"
          label="Content"
        />
        <PostFormButtonRow>
          <PostFormButton primary disabled={pristine || submitting}>
            {isEditing ? `Save` : `Post`}
          </PostFormButton>
          <PostFormButton
            type="reset"
            onClick={reset}
            disabled={pristine || submitting}
          >
            {isEditing ? (
              <IconWithText>
                <MdUndo size={18} /> Undo Changes
              </IconWithText>
            ) : (
              <IconWithText>
                <MdClear size={18} /> Clear
              </IconWithText>
            )}
          </PostFormButton>
        </PostFormButtonRow>
      </ul>
    </form>
  );
}

function PostFormButtonRow({ children }) {
  return <li className="post-form-button-row">{children}</li>;
}

function PostFormButton({
  children,
  type = `submit`,
  primary = false,
  disabled = false,
  onClick
}) {
  return (
    <button
      className={`post-form-button btn ${primary ? `btn-primary` : ``}`}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function IconWithText({ children }) {
  return <span className="vertical-center">{children}</span>;
}

function renderInputField({ input, label, type, meta }) {
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
        <ErrorsAndWarnings {...meta} />
      </div>
    </li>
  );
}

// Just renaming the keys to make the function more generic
function createOptionsFromCategories(categories) {
  return categories.map(({ path, name }) => ({ value: path, name }));
}

function renderSelectField({ input, label, options, meta }) {
  return (
    <li>
      <label className="post-form-label">{label}</label>
      <div className="post-form-input-container">
        <select className="post-form-input" {...input}>
          <option value="" disabled hidden>
            Choose a category
          </option>
          {options.map(option => (
            <option value={option.value} key={option.value}>
              {option.name}
            </option>
          ))}
        </select>
        <ErrorsAndWarnings {...meta} />
      </div>
    </li>
  );
}

function renderTextField({ input, label, rows, meta }) {
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
        <ErrorsAndWarnings {...meta} />
      </div>
    </li>
  );
}

// Receiving the meta information as props, renders any existing error or warning
function ErrorsAndWarnings({ touched, error, warning }) {
  if (touched && error) {
    return <span className="form-error">{error}</span>;
  }
  if (touched && warning) {
    return <span className="form-warning">{warning}</span>;
  }
  return null;
}
