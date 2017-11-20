import VoteScore from 'components/VoteScore';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { getPostById, votePostUp, votePostDown } from 'redux/modules/posts';

function mapStateToProps(state, { postId }) {
  return {
    score: getPostById(state, postId).voteScore
  };
}

function mapDispatchToProps(dispatch, { postId }) {
  return {
    onUpVote: () => dispatch(votePostUp(postId)),
    onDownVote: () => dispatch(votePostDown(postId))
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(VoteScore)
);
