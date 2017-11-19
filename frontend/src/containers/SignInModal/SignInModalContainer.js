import SignInModal from 'components/SignInModal';
import { connect } from 'react-redux';
import { localLogin, userFetchingDismissError } from 'redux/modules/users';
import { modalClose } from 'redux/modules/modal';

function mapStateToProps({ modal }) {
  return {
    isOpen: modal.isOpen
  };
}

export default connect(mapStateToProps, {
  modalClose,
  userFetchingDismissError
})(SignInModal);
