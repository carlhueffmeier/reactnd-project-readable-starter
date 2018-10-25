// Fetches comments for current post.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CommentType } from 'types';
import { connect } from 'react-redux';
import {
  fetchCommentsForPost,
  getCommentsForPost,
} from 'redux/modules/comments';
import CommentArea from 'components/CommentArea';
import Spinner from 'components/Spinner';

class CommentAreaContainer extends Component {
  static propTypes = {
    postId: PropTypes.string.isRequired,
    comments: PropTypes.arrayOf(CommentType).isRequired,
    isFetching: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,
    fetchCommentsForPost: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { fetchCommentsForPost, postId } = this.props;
    fetchCommentsForPost(postId);
  }

  render() {
    const { comments, isFetching, error, postId } = this.props;

    if (isFetching) {
      return <Spinner />;
    }

    if (error) {
      return <span>{error}</span>;
    }

    return <CommentArea comments={comments} postId={postId} />;
  }
}

function mapStateToProps(state, { postId }) {
  return {
    comments: getCommentsForPost(state, postId),
    isFetching: state.entities.comments.isFetching,
    error: state.entities.comments.error,
  };
}

export default connect(
  mapStateToProps,
  { fetchCommentsForPost }
)(CommentAreaContainer);
