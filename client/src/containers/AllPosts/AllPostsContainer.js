// Page that shows posts of all categories

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PostType } from 'types';
import { connect } from 'react-redux';
import { fetchAllPosts, getAllPosts } from 'redux/modules/posts';
import PostList from 'containers/PostList';
import Spinner from 'components/Spinner';

class AllPostsContainer extends Component {
  static propTypes = {
    posts: PropTypes.arrayOf(PostType).isRequired,
    fetchAllPosts: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,
  };

  // Fetch posts when page is navigated to
  componentDidMount() {
    this.props.fetchAllPosts();
  }

  render() {
    const { isFetching, error, posts } = this.props;

    if (posts.length === 0 && isFetching) {
      return <Spinner />;
    }

    if (posts.length === 0 && error) {
      return <span>{error}</span>;
    }

    return <PostList posts={posts} />;
  }
}

function mapStateToProps(state) {
  return {
    posts: getAllPosts(state),
    isFetching: state.entities.posts.isFetching,
    error: state.entities.posts.error,
  };
}

export default connect(
  mapStateToProps,
  { fetchAllPosts }
)(AllPostsContainer);
