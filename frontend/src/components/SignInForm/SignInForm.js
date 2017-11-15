import React from 'react';
import PropTypes from 'prop-types';
import Spinner from 'components/Spinner';
import './styles.css';

SignInForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isSubmitDisabled: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  modalUpdateUsername: PropTypes.func.isRequired,
  modalUpdatePassword: PropTypes.func.isRequired
};

export default function SignInForm(props) {
  return (
    <form className="login-modal-form" onSubmit={props.onSubmit}>
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
        {props.isFetching ? <Spinner size={30} color="white" /> : `Sign In`}
      </button>
      <a href="/auth/google">
        <div className="btn login-modal-login-with-google-btn">
          <span>Sign in with Google</span>
        </div>
      </a>
    </form>
  );
}
