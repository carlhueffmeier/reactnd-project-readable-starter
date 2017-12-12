import SortControls from 'components/SortControls';
import { connect } from 'react-redux';
import { changeCommentSortOrder } from 'redux/modules/ui';

function mapStateToProps({ ui }) {
  return {
    sortOrder: ui.commentSortOrder
  };
}

const mapDispatchToProps = {
  changeSortOrder: changeCommentSortOrder
};

export default connect(mapStateToProps, mapDispatchToProps)(SortControls);
