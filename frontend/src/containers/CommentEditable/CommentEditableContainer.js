// The id of the comment being edited is kept in our store to facilitate
// communication between components.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CommentType } from 'types';
import { connect } from 'react-redux';
import { editComment } from 'redux/modules/comments';
import { stopEditingComment } from 'redux/modules/ui';
import CommentEditable from 'components/CommentEditable';

class CommentEditableContainer extends Component {
  static propTypes = {
    comment: CommentType.isRequired,
    editComment: PropTypes.func.isRequired,
    stopEditingComment: PropTypes.func.isRequired
  };

  saveModifiedComment(formData) {
    const { editComment, comment } = this.props;
    editComment(comment.id, formData);
  }

  cancelEdit() {
    this.props.stopEditingComment();
  }

  render() {
    return (
      <CommentEditable
        comment={this.props.comment}
        onSaveEdit={this.saveModifiedComment.bind(this)}
        onCancelEdit={this.cancelEdit.bind(this)}
      />
    );
  }
}

export default connect(null, { editComment, stopEditingComment })(
  CommentEditableContainer
);
