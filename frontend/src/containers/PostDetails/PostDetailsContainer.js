import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PostType } from 'types';
import { connect } from 'react-redux';
import { fetchPostById, getPostById } from 'redux/modules/posts';
import PostDetails from 'components/PostDetails';
import Spinner from 'components/Spinner';
import { Redirect } from 'react-router-dom';

class PostDetailsContainer extends Component {
  static propTypes = {
    post: PostType,
    fetchPostById: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { fetchPostById, postId } = this.props;
    fetchPostById(postId);
  }

  handleAbsenceOfPost({ isFetching, error }) {
    if (isFetching) {
      return <Spinner />;
    } else if (error) {
      return <span>{error}</span>;
    }
    // We have no post, no error and it is not fetching right now
    // The post must have been deleted.
    return <Redirect to="/" />;
  }

  render() {
    const { post, isFetching, error } = this.props;
    if (!post) {
      return this.handleAbsenceOfPost({ isFetching, error });
    }

    return <PostDetails post={post} />;
  }
}

function mapStateToProps(state, { match }) {
  const postIdFromUrl = match.params.post_id;
  return {
    postId: postIdFromUrl,
    post: getPostById(state, postIdFromUrl),
    isFetching: state.entities.posts.isFetching,
    error: state.entities.posts.error
  };
}

export default connect(mapStateToProps, { fetchPostById })(
  PostDetailsContainer
);
