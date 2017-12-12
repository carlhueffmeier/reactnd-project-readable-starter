// Renders the given post.
// There are a few flags that influence how it is rendered.
// It doesn't look very clean and it might be better to just
// break it out into separate components if the options grow
// beyond the current two flags.

import React from 'react';
import PropTypes from 'prop-types';
import { PostType } from 'types';
import { Link } from 'react-router-dom';
import PostVoteScore from 'containers/PostVoteScore';
import PostActionBar from 'containers/PostActionBar';
import { formatTimestamp, renderNewlines } from 'helpers/utils';
import './styles.css';

Post.propTypes = {
  post: PostType.isRequired,
  withLink: PropTypes.bool,
  showNewlines: PropTypes.bool
};

export default function Post(props) {
  const { id, timestamp, title, author, body, category } = props.post;
  return (
    <article className="post">
      <PostVoteScore postId={id} />
      <div className="post-content">
        <PostTitle withLink={props.withLink} linkTo={`/${category}/${id}`}>
          {title}
        </PostTitle>
        <PostSubtitle
          author={author}
          timestamp={timestamp}
          category={category}
        />
        <PostBody showNewlines={props.showNewlines}>{body}</PostBody>
        <PostActionBar postId={id} />
      </div>
    </article>
  );
}

function PostTitle({ children, withLink, linkTo }) {
  return (
    <h2 className="post-title">
      {withLink ? <Link to={linkTo}>{children}</Link> : children}
    </h2>
  );
}

function PostSubtitle({ author, timestamp, category }) {
  return (
    <span className="post-subtitle">
      <strong>{author.displayName}</strong>
      {` - ${formatTimestamp(timestamp)} in ${category}`}
    </span>
  );
}

function PostBody({ showNewlines, children }) {
  return (
    <p className="post-body">
      {showNewlines ? renderNewlines(children) : children}
    </p>
  );
}
