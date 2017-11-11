import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import Spinner from 'components/Spinner';
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

Login.propTypes = {
  modalOpen: PropTypes.func.isRequired,
  modalClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isSubmitDisabled: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  modalUpdateUsername: PropTypes.func.isRequired,
  modalUpdatePassword: PropTypes.func.isRequired,
  localLogin: PropTypes.func.isRequired
};

export default function Login(props) {
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
      <button className="btn btn-primary login-btn" onClick={props.modalOpen}>
        Login
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
        <form className="login-modal-form" onSubmit={onSubmit}>
          <input
            onChange={e => props.modalUpdateUsername(e.target.value)}
            value={props.username}
            maxLength={140}
            type="text"
            className="login-modal-input"
            placeholder="Username"
          />
          <input
            onChange={e => props.modalUpdatePassword(e.target.value)}
            value={props.password}
            maxLength={140}
            type="password"
            className="login-modal-input"
            placeholder="Password"
          />
          <span className="login-modal-error-text">{props.error}</span>
          <button
            className="btn btn-primary login-modal-submit-btn"
            disabled={props.isSubmitDisabled}
            type="submit"
          >
            {props.isFetching ? <Spinner size={30} color="white" /> : `Login`}
          </button>
          <a href="/auth/google">
            <div className="btn login-modal-login-with-google-btn">
              <span>Login with Google</span>
            </div>
          </a>
        </form>
      </ReactModal>
    </div>
  );
}
