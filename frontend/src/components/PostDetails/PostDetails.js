import React from 'react';
import { PostType } from 'types';
import Post from 'components/Post';
import './styles.css';

PostDetails.propTypes = {
  post: PostType.isRequired
};

export default function PostDetails({ post }) {
  return (
    <div>
      <Post post={post} renderNewLines />
    </div>
  );
}
