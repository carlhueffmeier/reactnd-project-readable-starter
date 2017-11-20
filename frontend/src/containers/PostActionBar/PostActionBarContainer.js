import ActionBar from 'components/ActionBar';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { deletePost } from 'redux/modules/posts';

function mapDispatchToProps(dispatch, { postId, history }) {
  return {
    onEdit: () => history.push(`/edit/${postId}`),
    onDelete: () => dispatch(deletePost(postId))
  };
}

export default withRouter(connect(null, mapDispatchToProps)(ActionBar));
