// Shows comment creation form if authenticated or asks user to sign in if not

import React from 'react';
import PropTypes from 'prop-types';
import CommentNewForm from 'containers/CommentNewForm';
import CheckAuthed from 'containers/CheckAuthed';
import PleaseSignIn from 'containers/PleaseSignIn';

CommentNew.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default function CommentNew(props) {
  return (
    <CheckAuthed>
      {isAuthed =>
        isAuthed ? (
          <CommentNewForm onSubmit={props.onSubmit} />
        ) : (
          <PleaseSignIn />
        )
      }
    </CheckAuthed>
  );
}
