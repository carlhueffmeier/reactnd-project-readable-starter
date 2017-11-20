import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchCurrentUser } from 'redux/modules/users';
import SignInAndOutButton from 'containers/SignInAndOutButton';

class AuthenticationContainer extends Component {
  componentDidMount() {
    this.props.fetchCurrentUser();
  }

  render() {
    return <SignInAndOutButton />;
  }
}

export default connect(null, { fetchCurrentUser })(AuthenticationContainer);
