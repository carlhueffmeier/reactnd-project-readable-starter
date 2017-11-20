import React from 'react';
import PropTypes from 'prop-types';
import PostSummary from 'components/PostSummary';
import { PostType } from 'types';
import './styles.css';

PostList.propTypes = {
  posts: PropTypes.arrayOf(PostType).isRequired
};

export default function PostList({ posts }) {
  return (
    <div>
      <div className="post-list">
        {posts && posts.map(post => <PostSummary key={post.id} post={post} />)}
      </div>
    </div>
  );
}
