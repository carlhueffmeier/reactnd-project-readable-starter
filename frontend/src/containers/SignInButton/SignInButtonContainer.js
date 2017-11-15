import { connect } from 'react-redux';
import SignInButton from 'components/SignInButton';
import { modalOpen, modalClose } from 'redux/modules/modal';
import { localLogin, userFetchingDismissError } from 'redux/modules/users';

function mapStateToProps({ modal }, props) {
  return {
    username: modal.username,
    password: modal.password,
    isOpen: modal.isOpen,
    buttonProps: props
  };
}

export default connect(mapStateToProps, {
  modalOpen,
  modalClose,
  localLogin,
  userFetchingDismissError
})(SignInButton);
