import React from 'react';
import PropTypes from 'prop-types';
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/lib/md';
import './styles.css';

VoteScore.propTypes = {
  score: PropTypes.number.isRequired,
  onUpVote: PropTypes.func.isRequired,
  onDownVote: PropTypes.func.isRequired
};

export default function VoteScore({ score, onUpVote, onDownVote }) {
  return (
    <div className="vote">
      <button onClick={onUpVote} className="vote-btn">
        <MdKeyboardArrowUp size={30} />
      </button>
      <span className="vote-score">{score}</span>
      <button onClick={onDownVote} className="vote-btn">
        <MdKeyboardArrowDown size={30} />
      </button>
    </div>
  );
}
