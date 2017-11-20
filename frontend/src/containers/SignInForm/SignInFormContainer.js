import SignInForm from 'components/SignInForm';
import { connect } from 'react-redux';
import { modalUpdateUsername, modalUpdatePassword } from 'redux/modules/modal';
import { localLogin } from 'redux/modules/users';

function mapStateToProps({ modal, entities }) {
  return {
    username: modal.username,
    password: modal.password,
    error: entities.users.error,
    isFetching: entities.users.isFetching,
    isSubmitDisabled:
      modal.username.length === 0 ||
      modal.password.length === 0 ||
      entities.users.isFetching
  };
}

export default connect(mapStateToProps, {
  modalUpdateUsername,
  modalUpdatePassword,
  localLogin
})(SignInForm);
