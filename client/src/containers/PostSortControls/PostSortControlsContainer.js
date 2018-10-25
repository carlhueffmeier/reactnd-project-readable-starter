import SortControls from 'components/SortControls';
import { connect } from 'react-redux';
import { changePostSortOrder } from 'redux/modules/ui';

function mapStateToProps({ ui }) {
  return {
    sortOrder: ui.postSortOrder,
  };
}

const mapDispatchToProps = {
  changeSortOrder: changePostSortOrder,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SortControls);
