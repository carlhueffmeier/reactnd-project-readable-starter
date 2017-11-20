import SignInAndOutButton from 'components/SignInAndOutButton';
import { connect } from 'react-redux';

function mapStateToProps({ entities }) {
  return {
    isAuthed: entities.users.isAuthed,
    isFetching: entities.users.isFetching
  };
}

export default connect(mapStateToProps)(SignInAndOutButton);
