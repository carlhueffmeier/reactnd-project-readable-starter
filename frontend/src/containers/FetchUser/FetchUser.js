// Just checks whether we are logged in when mounted.
// Renders nothing.

import { Component } from 'react';
import { connect } from 'react-redux';
import { fetchCurrentUser } from 'redux/modules/users';

class FetchUser extends Component {
  componentDidMount() {
    this.props.fetchCurrentUser();
  }

  render() {
    return null;
  }
}

export default connect(null, { fetchCurrentUser })(FetchUser);
