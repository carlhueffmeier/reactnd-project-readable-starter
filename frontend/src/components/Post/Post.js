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
  renderNewlines: PropTypes.bool
};

export default function Post(props) {
  const { id, timestamp, title, author, body, category } = props.post;
  return (
    <article className="post">
      <PostVoteScore postId={id} />
      <div className="post-content">
        <h3 className="post-title">
          {props.withLink ? (
            <Link to={`/posts/${id}`}>{title}</Link>
          ) : (
            { title }
          )}
        </h3>
        <span className="post-subtitle">
          <strong>{author.displayName}</strong>
          {` - ${formatTimestamp(timestamp)} in ${category}`}
        </span>
        <p className="post-body">
          {props.renderNewlines ? renderNewlines(body) : body}
        </p>
        <PostActionBar postId={id} />
      </div>
    </article>
  );
}
