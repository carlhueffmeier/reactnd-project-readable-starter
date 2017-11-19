import SignInAndOutButton from 'components/SignInAndOutButton';
import { connect } from 'react-redux';

function mapStateToProps({ users }) {
  return {
    isAuthed: users.isAuthed,
    isFetching: users.isFetching
  };
}

export default connect(mapStateToProps)(SignInAndOutButton);
