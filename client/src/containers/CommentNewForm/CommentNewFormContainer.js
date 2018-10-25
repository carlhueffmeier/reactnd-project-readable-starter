import CommentNewForm from 'components/CommentNewForm';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';

CommentNewForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default reduxForm({ form: `commentNew` })(CommentNewForm);
