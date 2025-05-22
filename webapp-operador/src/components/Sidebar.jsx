"use client"

import { XIcon, Package, Map, Truck, Home } from "lucide-react"
import { NavLink } from "react-router-dom"

export default function Sidebar({ open, setOpen }) {
  return (
    <>
      {/* Overlay para móvil */}
      {open && (
        <div className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar para móvil */}
      <div
        className={`fixed inset-y-0 left-0 flex flex-col z-40 w-64 bg-white shadow-lg transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <span className="text-xl font-bold text-blue-600">WebApp Operador</span>
          <button
            type="button"
            className="h-10 w-10 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={() => setOpen(false)}
          >
            <span className="sr-only">Cerrar menú</span>
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1 px-2 py-4 bg-white space-y-1 overflow-y-auto">
          <NavItems />
        </nav>
      </div>

      {/* Sidebar para desktop */}
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 z-10 bg-white shadow-lg">
        <div className="flex items-center h-16 px-4 border-b border-gray-200">
          <span className="text-xl font-bold text-blue-600">WebApp Operador</span>
        </div>
        <nav className="flex-1 px-2 py-4 bg-white space-y-1 overflow-y-auto">
          <NavItems />
        </nav>
      </div>
    </>
  )
}

function NavItems() {
  return (
    <>
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex items-center px-2 py-2 text-base font-medium rounded-md ${
            isActive ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`
        }
      >
        <Home className="mr-3 h-5 w-5" />
        Inicio
      </NavLink>
      <NavLink
        to="/paquetes"
        className={({ isActive }) =>
          `flex items-center px-2 py-2 text-base font-medium rounded-md ${
            isActive ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`
        }
      >
        <Package className="mr-3 h-5 w-5" />
        Paquetes
      </NavLink>
      <NavLink
        to="/paquetes/nuevo"
        className={({ isActive }) =>
          `flex items-center px-2 py-2 text-base font-medium rounded-md ${
            isActive ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`
        }
      >
        <Package className="mr-3 h-5 w-5" />
        Nuevo Paquete
      </NavLink>
      <NavLink
        to="/rutas"
        className={({ isActive }) =>
          `flex items-center px-2 py-2 text-base font-medium rounded-md ${
            isActive ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`
        }
      >
        <Map className="mr-3 h-5 w-5" />
        Rutas
      </NavLink>
      <NavLink
        to="/entregas"
        className={({ isActive }) =>
          `flex items-center px-2 py-2 text-base font-medium rounded-md ${
            isActive ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`
        }
      >
        <Truck className="mr-3 h-5 w-5" />
        Entregas
      </NavLink>
    </>
  )
}
