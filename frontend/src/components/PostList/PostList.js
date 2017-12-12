// Displays a sortable list of posts given

import React from 'react';
import PropTypes from 'prop-types';
import { PostType } from 'types';
import PostSummary from 'components/PostSummary';
import PostSortControls from 'containers/PostSortControls';
import { Link } from 'react-router-dom';
import './styles.css';

PostList.propTypes = {
  posts: PropTypes.arrayOf(PostType).isRequired
};

export default function PostList({ posts }) {
  if (posts.length === 0) return <NoPostsYet />;

  return (
    <div>
      <PostSortControls />
      <div className="post-list">
        {posts && posts.map(post => <PostSummary key={post.id} post={post} />)}
      </div>
    </div>
  );
}

function NoPostsYet() {
  return (
    <p style={{ textAlign: `center` }}>
      {`No posts yet! How about you `}
      <Link to="/create">write the first one?</Link>
    </p>
  );
}
