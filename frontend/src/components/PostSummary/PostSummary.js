// Displays a shortened post with a link to its details page

import React from 'react';
import Post from 'components/Post';
import { PostType } from 'types';

PostSummary.propTypes = {
  post: PostType.isRequired
};

export default function PostSummary({ post }) {
  const summarizedPost = { ...post, body: summarizeText(post.body) };
  return <Post withLink post={summarizedPost} />;
}

function summarizeText(text) {
  if (text.length > 80) {
    return `${text.substr(0, 80)}...`;
  } else {
    return text;
  }
}
