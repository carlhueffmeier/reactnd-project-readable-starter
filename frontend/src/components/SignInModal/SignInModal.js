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

SignInModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  modalClose: PropTypes.func.isRequired,
  userFetchingDismissError: PropTypes.func.isRequired
};

export default function SignInModal(props) {
  function dismissErrorsAndCloseModal() {
    props.userFetchingDismissError();
    props.modalClose();
  }

  return (
    <ReactModal
      style={modalStyles}
      isOpen={props.isOpen}
      onRequestClose={dismissErrorsAndCloseModal}
    >
      <div>
        <button
          onClick={dismissErrorsAndCloseModal}
          className="login-modal-close-btn"
        >
          ×
        </button>
      </div>
      <SignInForm onSuccess={props.modalClose} />
    </ReactModal>
  );
}
