import PostForm from 'components/PostForm';
import PropTypes from 'prop-types';
import { CategoryType } from 'types';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { getCategories } from 'redux/modules/categories';

PostForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(CategoryType).isRequired,
};

export default connect(mapStateToProps)(
  reduxForm({ form: `post`, validate, warn })(PostForm)
);

// Getting all categories for the drop-down
function mapStateToProps(state) {
  return {
    categories: getCategories(state),
  };
}

// Critical errors preventing submission
function validate(values) {
  const errors = {};
  if (!values.title) {
    errors.title = `Your post needs a title.`;
  }
  if (!values.category) {
    errors.category = `Choose a category.`;
  }
  if (!values.body) {
    errors.body = `Oops, your post is empty.`;
  }
  return errors;
}

// Warnings are displayed but don't prevent submission
function warn(values) {
  const warnings = {};
  if (values.title && values.title.length < 5) {
    warnings.title = `Your title seems a little short.`;
  }
  return warnings;
}
