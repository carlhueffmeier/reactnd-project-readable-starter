// Shows current voteScore and buttons to let the user give his/her vote.
// Similar to the vote components on reddit.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/lib/md';
import { VOTE_UP, VOTE_DOWN } from 'helpers/constants';
import './styles.css';

export default class VoteScore extends Component {
  static propTypes = {
    score: PropTypes.number.isRequired,
    userVote: PropTypes.oneOf([VOTE_UP, VOTE_DOWN, null]),
    isAuthed: PropTypes.bool.isRequired,
    signIn: PropTypes.func.isRequired,
    onUpVote: PropTypes.func.isRequired,
    onDownVote: PropTypes.func.isRequired,
    onRemoveVote: PropTypes.func.isRequired
  };

  toggleUpVote() {
    if (this.props.userVote === VOTE_UP) {
      this.props.onRemoveVote();
    } else {
      this.props.onUpVote();
    }
  }

  toggleDownVote() {
    if (this.props.userVote === VOTE_DOWN) {
      this.props.onRemoveVote();
    } else {
      this.props.onDownVote();
    }
  }

  checkAuthed(executeIfAuthed) {
    if (!this.props.isAuthed) {
      this.props.signIn();
    } else {
      executeIfAuthed();
    }
  }

  handleClickUp() {
    this.checkAuthed(this.toggleUpVote.bind(this));
  }

  handleClickDown() {
    this.checkAuthed(this.toggleDownVote.bind(this));
  }

  render() {
    const { score, userVote } = this.props;
    return (
      <div className={`vote ${userVote}`}>
        <button
          onClick={this.handleClickUp.bind(this)}
          className="vote-btn vote-btn-up"
        >
          <MdKeyboardArrowUp size={40} />
        </button>
        <span className="vote-score">{score}</span>
        <button
          onClick={this.handleClickDown.bind(this)}
          className="vote-btn vote-btn-down"
        >
          <MdKeyboardArrowDown size={40} />
        </button>
      </div>
    );
  }
}
