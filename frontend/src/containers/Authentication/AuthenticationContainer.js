import React, { Component } from 'react';
import { connect } from 'react-redux';
import SignInAndOutButton from 'components/SignInAndOutButton';
import { fetchCurrentUser } from 'redux/modules/users';

class AuthenticationContainer extends Component {
  componentDidMount() {
    this.props.fetchCurrentUser();
  }

  render() {
    return <SignInAndOutButton />;
  }
}

export default connect(null, { fetchCurrentUser })(AuthenticationContainer);
