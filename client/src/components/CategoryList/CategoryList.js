// Navigation between categories

import React from 'react';
import PropTypes from 'prop-types';
import { CategoryType } from 'types';
import { NavLink } from 'react-router-dom';
import './styles.css';

CategoryList.propTypes = {
  categories: PropTypes.arrayOf(CategoryType).isRequired,
};

export default function CategoryList({ categories }) {
  return (
    <ul className="category-list">
      <li className="nav-item">
        <NavLink exact={true} to={`/`}>
          All
        </NavLink>
      </li>
      {categories.map(category => (
        <li className="nav-item" key={category.path}>
          <NavLink exact={true} to={`/${category.path}`}>
            {category.name}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
