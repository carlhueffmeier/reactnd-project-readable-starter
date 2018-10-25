// Politely asks the user to sign in

import React from 'react';
import PropTypes from 'prop-types';

PleaseSignIn.propTypes = {
  signIn: PropTypes.func.isRequired,
};

export default function PleaseSignIn(props) {
  return (
    <p>
      {`Please `}
      <button className="btn btn-link" onClick={props.signIn}>
        sign in
      </button>
      {` to share your thoughts.`}
    </p>
  );
}
