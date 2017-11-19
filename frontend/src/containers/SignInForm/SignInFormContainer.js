import SignInForm from 'components/SignInForm';
import { connect } from 'react-redux';
import { modalUpdateUsername, modalUpdatePassword } from 'redux/modules/modal';
import { localLogin } from 'redux/modules/users';

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
  modalUpdatePassword,
  localLogin
})(SignInForm);
