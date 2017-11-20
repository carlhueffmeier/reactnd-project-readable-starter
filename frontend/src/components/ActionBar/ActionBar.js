import React from 'react';
import PropTypes from 'prop-types';
import './styles.css';

ActionBar.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default function ActionBar({ onEdit, onDelete }) {
  return (
    <footer className="action-bar">
      <button className="btn btn-link btn-sm" onClick={onEdit}>
        Edit
      </button>
      {` `}
      <button className="btn btn-link btn-sm" onClick={onDelete}>
        Delete
      </button>
    </footer>
  );
}
