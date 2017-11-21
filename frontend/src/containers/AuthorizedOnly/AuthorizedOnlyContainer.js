import { connect } from 'react-redux';

function AuthorizedOnlyContainer({ isAuthed, children }) {
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

export default connect(mapStateToProps)(AuthorizedOnlyContainer);
