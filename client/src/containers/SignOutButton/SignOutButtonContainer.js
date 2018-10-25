import { connect } from 'react-redux';
import { logout } from 'redux/modules/users';
import SignOutButton from 'components/SignOutButton';

export default connect(
  null,
  { logout }
)(SignOutButton);
