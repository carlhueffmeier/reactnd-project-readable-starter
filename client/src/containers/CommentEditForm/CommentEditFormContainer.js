import CommentEditForm from 'components/CommentEditForm';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';

CommentEditForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default reduxForm({
  validate,
})(CommentEditForm);

function validate(values) {
  if (!values.body) {
    return { body: `Empty comments are not valid.` };
  }
}
