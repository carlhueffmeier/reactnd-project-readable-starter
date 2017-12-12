// Page that shows posts of a specific category

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PostType } from 'types';
import { connect } from 'react-redux';
import { fetchPostsByCategory, getPostsByCategory } from 'redux/modules/posts';
import PostList from 'containers/PostList';
import Spinner from 'components/Spinner';

class CategoryContainer extends Component {
  static propTypes = {
    posts: PropTypes.arrayOf(PostType).isRequired,
    fetchPostsByCategory: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired
  };

  // Re-fetch all posts on mount
  componentDidMount() {
    this.props.fetchPostsByCategory(this.props.category);
  }

  // We have to fetch posts when changing categories, too
  componentWillReceiveProps(nextProps) {
    const currentCategory = this.props.category;
    const nextCategory = nextProps.match.params.category;
    if (nextCategory !== currentCategory) {
      this.props.fetchPostsByCategory(nextCategory);
    }
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

function mapStateToProps(state, { match }) {
  // We get the category from our url
  const { category } = match.params;
  return {
    posts: getPostsByCategory(state, category),
    category,
    isFetching: state.entities.posts.isFetching,
    error: state.entities.posts.error
  };
}

export default connect(mapStateToProps, { fetchPostsByCategory })(
  CategoryContainer
);
