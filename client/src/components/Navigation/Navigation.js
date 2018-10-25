// Navbar

import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import SignInAndOutButton from 'containers/SignInAndOutButton';

import './styles.css';

export default function Navigation() {
  return (
    <Navbar>
      <NavItem className="nav-brand">
        <Link to="/">
          <h1 className="brand">Readable</h1>
        </Link>
      </NavItem>
      <NavItem>
        <Link to="/">Home</Link>
      </NavItem>
      <NavItem>
        <NavLink exact={true} activeClassName="active" to="/create">
          New Post
        </NavLink>
      </NavItem>
      <NavItem>
        <SignInAndOutButton />
      </NavItem>
    </Navbar>
  );
}

function Navbar({ children }) {
  return (
    <nav className="nav-top">
      <ul className="nav-bar">{children}</ul>
    </nav>
  );
}

function NavItem({ children, className }) {
  return <li className={`nav-item ${className}`}>{children}</li>;
}
