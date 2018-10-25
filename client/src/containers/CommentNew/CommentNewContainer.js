// Responsible for saving the comment

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createAndSaveNewComment } from 'redux/modules/comments';
import CommentNew from 'components/CommentNew';

class CommentNewContainer extends Component {
  static propTypes = {
    createAndSaveNewComment: PropTypes.func.isRequired,
    postId: PropTypes.string.isRequired,
  };

  handleSubmit(formData) {
    const newComment = { ...formData, parentId: this.props.postId };
    this.props.createAndSaveNewComment(newComment);
  }

  render() {
    return <CommentNew onSubmit={this.handleSubmit.bind(this)} />;
  }
}

export default connect(
  null,
  { createAndSaveNewComment }
)(CommentNewContainer);
