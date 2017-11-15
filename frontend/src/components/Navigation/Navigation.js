import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import Authentication from 'containers/Authentication';
import './styles.css';

export default function Navigation() {
  return (
    <nav className="nav-top">
      <ul className="nav-bar">
        <li className="nav-brand">
          <Link className="brand" to="/">
            <b>Readable</b>
          </Link>
        </li>
        <li className="nav-item">
          <NavLink exact={true} activeClassName="active" to="/">
            Home
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink exact={true} activeClassName="active" to="/create">
            New Post
          </NavLink>
        </li>
        <li className="nav-item">
          <Authentication />
        </li>
      </ul>
    </nav>
  );
}
