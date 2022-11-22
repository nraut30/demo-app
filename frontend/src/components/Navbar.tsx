import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <header className="main-navigation">
      <div className="main-navigation_logo">
        <h1>BookStore</h1>
      </div>
      <nav className="main-navigation_items">
        <ul>
          <li>
            <NavLink to="/"> Authenticate </NavLink>
          </li>
          <li>
            <NavLink to="/books"> Books </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
