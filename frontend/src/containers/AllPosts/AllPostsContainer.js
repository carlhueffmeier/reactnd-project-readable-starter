import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAllPosts, getAllPosts } from 'redux/modules/posts';
import PostList from 'components/PostList';

class AllPostsContainer extends Component {
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
