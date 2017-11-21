import PostList from 'components/PostList';
import { connect } from 'react-redux';
import { sortBy } from 'helpers/utils';

function mapStateToProps({ ui }, { posts }) {
  return {
    posts: sortBy(posts, ui.postSortOrder)
  };
}

export default connect(mapStateToProps)(PostList);
