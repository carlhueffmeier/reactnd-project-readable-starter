// Post creation page.
// It renders the form when the user is logged in.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createAndSaveNewPost } from 'redux/modules/posts';
import PleaseSignIn from 'containers/PleaseSignIn';
import PostForm from 'containers/PostForm';
import CheckAuthed from 'containers/CheckAuthed';
import Spinner from 'components/Spinner';

class PostNewContainer extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    createAndSaveNewPost: PropTypes.func.isRequired
  };

  handleSubmit(formData) {
    this.props.createAndSaveNewPost(formData);
    this.props.history.push(`/`);
  }

  render() {
    if (this.props.isFetching) {
      return <Spinner />;
    }

    return (
      <CheckAuthed>
        {isAuthed =>
          isAuthed ? (
            <PostForm onSubmit={this.handleSubmit.bind(this)} />
          ) : (
            <PleaseSignIn />
          )
        }
      </CheckAuthed>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFetching: state.entities.users.isFetching
  };
}

export default connect(mapStateToProps, { createAndSaveNewPost })(
  PostNewContainer
);
