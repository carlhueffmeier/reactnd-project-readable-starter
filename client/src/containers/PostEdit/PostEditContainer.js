// Fetches post and protects the edit form with the CheckPostEditRights container.

import React, { Component } from 'react';
import { pick } from 'lodash';
import PropTypes from 'prop-types';
import { PostType } from 'types';
import { connect } from 'react-redux';
import { getPostById, fetchPostById, editPost } from 'redux/modules/posts';
import { getCurrentUser } from 'redux/modules/users';
import PostForm from 'containers/PostForm';
import Spinner from 'components/Spinner';
import CheckPostEditRights from 'containers/CheckPostEditRights';

class PostEditContainer extends Component {
  static propTypes = {
    postId: PropTypes.string.isRequired,
    post: PostType,
    fetchPostById: PropTypes.func.isRequired,
    editPost: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.fetchPostById(this.props.postId);
  }

  handleSubmit(formData) {
    this.props.editPost(this.props.postId, formData);
    this.props.history.push(`/`);
  }

  handleAbsenceOfPost({ isFetching, error }) {
    if (isFetching) {
      return <Spinner />;
    }

    return <span>{error}</span>;
  }

  render() {
    const { post, isFetching, error } = this.props;
    if (!post) {
      return this.handleAbsenceOfPost({ isFetching, error });
    }

    const editableProperties = pick(post, [`title`, `category`, `body`]);
    return (
      <CheckPostEditRights post={post}>
        <PostForm
          onSubmit={this.handleSubmit.bind(this)}
          initialValues={editableProperties}
        />
      </CheckPostEditRights>
    );
  }
}

function mapStateToProps(state, { match }) {
  const postIdFromUrl = match.params.post_id;
  return {
    currentUser: getCurrentUser(state),
    postId: postIdFromUrl,
    post: getPostById(state, postIdFromUrl),
    isFetching: state.entities.posts.isFetching,
    error: state.entities.posts.error,
  };
}

export default connect(
  mapStateToProps,
  { editPost, fetchPostById }
)(PostEditContainer);
