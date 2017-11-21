import { connect } from 'react-redux';
import PropTypes from 'prop-types';

AuthedOnlyContainer.propTypes = {
  isAuthed: PropTypes.bool.isRequired,
  children: PropTypes.object.isRequired
};

function AuthedOnlyContainer({ isAuthed, children }) {
  if (isAuthed) {
    return children;
  }

  return `Please sign in first.`;
}

function mapStateToProps(state) {
  return {
    isAuthed: state.entities.users.isAuthed
  };
}

export default connect(mapStateToProps)(AuthedOnlyContainer);
