// The page showing the whole post

import React from 'react';
import { PostType } from 'types';
import Post from 'components/Post';
import CommentArea from 'containers/CommentArea';
import './styles.css';

PostDetails.propTypes = {
  post: PostType.isRequired,
};

export default function PostDetails({ post }) {
  return (
    <div>
      <Post post={post} showNewlines />
      <CommentArea postId={post.id} />
    </div>
  );
}
