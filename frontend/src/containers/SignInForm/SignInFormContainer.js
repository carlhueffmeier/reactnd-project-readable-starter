import { connect } from 'react-redux';
import SignInForm from 'components/SignInForm';
import { modalUpdateUsername, modalUpdatePassword } from 'redux/modules/modal';

function mapStateToProps({ modal, users }) {
  return {
    username: modal.username,
    password: modal.password,
    error: users.error,
    isFetching: users.isFetching,
    isSubmitDisabled:
      modal.username.length === 0 ||
      modal.password.length === 0 ||
      users.isFetching
  };
}

export default connect(mapStateToProps, {
  modalUpdateUsername,
  modalUpdatePassword
})(SignInForm);
