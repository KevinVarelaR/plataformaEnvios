import React from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  const activeClass = "text-white bg-primary rounded px-3 py-2";
  const inactiveClass = "text-light px-3 py-2 rounded hover:bg-primary hover:text-white";

  return (
    <nav className="navbar navbar-expand bg-primary">
      <div className="container d-flex justify-content-center align-items-center">
        <div className="navbar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
          >
            Registrar
          </NavLink>
          <NavLink
            to="/consulta"
            className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
          >
            Consultar
          </NavLink>
          <NavLink
            to="/historial"
            className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
          >
            Historial
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Header;