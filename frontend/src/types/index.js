import PropTypes from 'prop-types';

export const UserType = PropTypes.shape({
  uid: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired
});

export const PostType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  timestamp: PropTypes.number.isRequired,
  body: PropTypes.string.isRequired,
  author: UserType.isRequired,
  category: PropTypes.string.isRequired,
  voteScore: PropTypes.number.isRequired,
  commentCount: PropTypes.number.isRequired
});
