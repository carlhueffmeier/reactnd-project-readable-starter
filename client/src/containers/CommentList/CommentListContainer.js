// The sort order is kept in our store to keep it consistent between page changes
// and make it easier to wire up.

import CommentList from 'components/CommentList';
import { connect } from 'react-redux';
import { sortBy } from 'helpers/utils';

function mapStateToProps({ ui }, { comments }) {
  return {
    comments: sortBy(comments, ui.commentSortOrder),
  };
}

export default connect(mapStateToProps)(CommentList);
