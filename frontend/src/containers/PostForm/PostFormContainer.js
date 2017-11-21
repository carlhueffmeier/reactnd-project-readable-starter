import PostForm from 'components/PostForm';
import { reduxForm } from 'redux-form';

export default reduxForm({ form: `post`, validate, warn })(PostForm);

function validate(values) {
  const errors = {};
  if (!values.title) {
    errors.title = `Your post needs a title.`;
  }
  if (!values.category) {
    errors.category = `Give your post a category.`;
  }
  if (!values.body) {
    errors.body = `Oops, your post is empty.`;
  }
  return errors;
}

function warn(values) {
  const warnings = {};
  if (values.title && values.title.length < 5) {
    warnings.title = `Your title seems a little short.`;
  }
  return warnings;
}
