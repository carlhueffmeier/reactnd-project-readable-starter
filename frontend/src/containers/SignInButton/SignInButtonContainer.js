import SignInButton from 'components/SignInButton';
import { connect } from 'react-redux';
import { modalOpen } from 'redux/modules/modal';

export default connect(null, { modalOpen })(SignInButton);
