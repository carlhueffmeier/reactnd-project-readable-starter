import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PostType } from 'types';
import { connect } from 'react-redux';
import { fetchAllPosts, getAllPosts } from 'redux/modules/posts';
import PostList from 'containers/PostList';

class AllPostsContainer extends Component {
  static propTypes = {
    posts: PropTypes.arrayOf(PostType).isRequired,
    fetchAllPosts: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.fetchAllPosts();
  }

  render() {
    return <PostList posts={this.props.posts} />;
  }
}

function mapStateToProps(state) {
  return {
    posts: getAllPosts(state)
  };
}

export default connect(mapStateToProps, { fetchAllPosts })(AllPostsContainer);
