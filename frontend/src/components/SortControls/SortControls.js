import React from 'react';
import PropTypes from 'prop-types';
import './styles.css';

SortControls.propTypes = {
  sortOrder: PropTypes.string.isRequired,
  changeSortOrder: PropTypes.func.isRequired
};

export default function SortControls({ sortOrder, changeSortOrder }) {
  function isChecked(value) {
    return value === sortOrder;
  }

  function onChange(event) {
    changeSortOrder(event.target.value);
  }

  return (
    <div className="sort-controls">
      <input
        type="radio"
        name="sort-by"
        value="date"
        id="sort-by-date"
        checked={isChecked(`date`)}
        onChange={onChange}
      />
      <label htmlFor="sort-by-date">Newest First</label>
      <input
        type="radio"
        name="sort-by"
        value="score"
        id="sort-by-score"
        checked={isChecked(`score`)}
        onChange={onChange}
      />
      <label htmlFor="sort-by-score">Top Rated</label>
    </div>
  );
}
