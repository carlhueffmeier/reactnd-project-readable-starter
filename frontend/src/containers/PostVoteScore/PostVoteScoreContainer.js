import VoteScore from 'components/VoteScore';
import { connect } from 'react-redux';
import { getPostById } from 'redux/modules/posts';
import { modalOpen } from 'redux/modules/modal';
import {
  getUserVoteForPost,
  votePostUp,
  votePostDown,
  votePostReset
} from 'redux/modules/userVotes';

function mapStateToProps(state, { postId }) {
  return {
    score: getPostById(state, postId).voteScore,
    userVote: getUserVoteForPost(state, postId),
    isAuthed: state.entities.users.isAuthed
  };
}

function mapDispatchToProps(dispatch, { postId }) {
  return {
    signIn: () => dispatch(modalOpen()),
    onUpVote: () => dispatch(votePostUp(postId)),
    onDownVote: () => dispatch(votePostDown(postId)),
    onRemoveVote: () => dispatch(votePostReset(postId))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(VoteScore);
