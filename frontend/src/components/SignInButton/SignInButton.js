import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import SignInForm from 'containers/SignInForm';
import './styles.css';

const modalStyles = {
  content: {
    width: 350,
    margin: '0px auto',
    height: 300,
    borderRadius: 5,
    background: '#EBEBEB',
    padding: 0
  }
};

SignInButton.propTypes = {
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  modalOpen: PropTypes.func.isRequired,
  modalClose: PropTypes.func.isRequired,
  userFetchingDismissError: PropTypes.func.isRequired,
  localLogin: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  buttonProps: PropTypes.object
};

export default function SignInButton(props) {
  function onSubmit(event) {
    event.preventDefault();
    const { localLogin, username, password } = props;
    localLogin(username, password).then(() => props.modalClose());
  }

  function onClose(event) {
    props.userFetchingDismissError();
    props.modalClose();
  }

  return (
    <div>
      <button {...props.buttonProps} onClick={props.modalOpen}>
        Sign in
      </button>
      <ReactModal
        style={modalStyles}
        isOpen={props.isOpen}
        onRequestClose={onClose}
      >
        <div>
          <button onClick={onClose} className="login-modal-close-btn">
            ×
          </button>
        </div>
        <SignInForm onSubmit={onSubmit} />
      </ReactModal>
    </div>
  );
}
