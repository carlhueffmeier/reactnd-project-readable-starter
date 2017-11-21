import PostForm from 'containers/PostForm';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createAndSaveNewPost } from 'redux/modules/posts';
import { getCurrentUser } from 'redux/modules/users';
import AuthorizedOnly from 'containers/AuthorizedOnly';

class PostNewContainer extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    createAndSaveNewPost: PropTypes.func.isRequired
  };

  handleSubmit(formData) {
    const props = { ...formData, author: this.props.currentUser.uid };
    this.props.createAndSaveNewPost(props);
    this.props.history.push(`/`);
  }

  render() {
    return (
      <AuthorizedOnly>
        <PostForm onSubmit={this.handleSubmit.bind(this)} />
      </AuthorizedOnly>
    );
  }
}

function mapStateToProps(state) {
  return {
    isAuthed: state.entities.users.isAuthed,
    currentUser: getCurrentUser(state)
  };
}

export default connect(mapStateToProps, { createAndSaveNewPost })(
  PostNewContainer
);
