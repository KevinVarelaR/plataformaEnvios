import React from "react";
import { NavLink } from "react-router-dom";

const Header = () => (
  <nav className="navbar navbar-expand navbar-dark bg-primary">
    <div className="container">
      <NavLink className="navbar-brand" to="/">
        Envios PWA
      </NavLink>
      <div className="navbar-nav">
        <NavLink className="nav-link" to="/" end>
          Registrar
        </NavLink>
        <NavLink className="nav-link" to="/consulta">
          Consultar
        </NavLink>
        <NavLink className="nav-link" to="/historial">
          Historial
        </NavLink>
      </div>
    </div>
  </nav>
);

export default Header;