import PostForm from 'containers/PostForm';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createAndSaveNewPost } from 'redux/modules/posts';
import { getCurrentUser } from 'redux/modules/users';
import AuthedOnly from 'containers/AuthedOnly';

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
      <AuthedOnly>
        <PostForm onSubmit={this.handleSubmit.bind(this)} />
      </AuthedOnly>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentUser: getCurrentUser(state)
  };
}

export default connect(mapStateToProps, { createAndSaveNewPost })(
  PostNewContainer
);
