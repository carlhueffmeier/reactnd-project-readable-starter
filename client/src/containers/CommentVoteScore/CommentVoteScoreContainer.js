import VoteScore from 'components/VoteScore';
import { connect } from 'react-redux';
import { getCommentById } from 'redux/modules/comments';
import { modalOpen } from 'redux/modules/modal';
import {
  getUserVoteForComment,
  voteCommentUp,
  voteCommentDown,
  voteCommentReset,
} from 'redux/modules/userVotes';

function mapStateToProps(state, { commentId }) {
  return {
    score: getCommentById(state, commentId).voteScore,
    userVote: getUserVoteForComment(state, commentId), // The vote of the currently logged in user
    isAuthed: state.entities.users.isAuthed,
  };
}

function mapDispatchToProps(dispatch, { commentId }) {
  return {
    // Sign in is started when the user tries to vote without being logged in
    signIn: () => dispatch(modalOpen()),
    onUpVote: () => dispatch(voteCommentUp(commentId)),
    onDownVote: () => dispatch(voteCommentDown(commentId)),
    onRemoveVote: () => dispatch(voteCommentReset(commentId)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VoteScore);
