import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

type NavbarProps = {
  contxt: {
    userId: String;
    token: String;
    tokenExpiration: String;
    books: Array<any>;
    showBooks: boolean;
    logoutUser: boolean;
  };
  logout: CallableFunction;
};

const Navbar: FC<NavbarProps> = ({ contxt, logout }) => {
  return (
    <header className="main-navigation">
      <div className="main-navigation_logo">
        <h1>BookStore</h1>
      </div>
      <nav className="main-navigation_items">
        <ul>
          {!contxt.showBooks && (
            <li>
              <NavLink to="/"> Authenticate </NavLink>
            </li>
          )}
          {contxt.showBooks && (
            <>
              <li>
                <NavLink to="/books"> Books </NavLink>
              </li>
              <li>
                <button onClick={() => logout(true)} className="logoutBtn">
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
