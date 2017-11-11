import { connect } from 'react-redux';
import Login from 'components/Login';
import * as modalActions from 'redux/modules/modal';
import { localLogin, userFetchingDismissError } from 'redux/modules/users';

function mapStateToProps({ modal, users }, props) {
  return {
    username: modal.username,
    password: modal.password,
    error: users.error,
    isOpen: modal.isOpen,
    isFetching: users.isFetching,
    isSubmitDisabled:
      modal.username.length === 0 ||
      modal.password.length === 0 ||
      users.isFetching
  };
}

export default connect(mapStateToProps, {
  ...modalActions,
  localLogin,
  userFetchingDismissError
})(Login);
