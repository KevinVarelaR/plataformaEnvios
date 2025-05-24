import React from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  const activeClass = "text-white bg-blue-800 rounded px-3 py-2";
  const inactiveClass = "text-blue-100 hover:bg-blue-700 hover:text-white rounded px-3 py-2";

  return (
    <header className="bg-blue-600 shadow">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <h1 className="text-white font-bold text-lg">Envios PWA</h1>
        <div className="space-x-2">
          <NavLink to="/" end className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
            Registrar
          </NavLink>
          <NavLink to="/consulta" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
            Consultar
          </NavLink>
          <NavLink to="/historial" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
            Historial
          </NavLink>
        </div>
      </nav>
    </header>
  );
};

export default Header;