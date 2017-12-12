import { connect } from 'react-redux';
import { modalOpen } from 'redux/modules/modal';
import PleaseSignIn from 'components/PleaseSignIn';

export default connect(null, { signIn: modalOpen })(PleaseSignIn);
