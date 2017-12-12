// Calls children function with the current authentication status

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

CheckAuthedContainer.propTypes = {
  isAuthed: PropTypes.bool.isRequired,
  children: PropTypes.func.isRequired
};

function CheckAuthedContainer({ isAuthed, children }) {
  return children(isAuthed);
}

function mapStateToProps(state) {
  return {
    isAuthed: state.entities.users.isAuthed
  };
}

export default connect(mapStateToProps)(CheckAuthedContainer);
